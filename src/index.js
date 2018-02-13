import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import kue from 'kue';
import fs from 'fs';
import csv from 'fast-csv';

import AuthController from './controllers/Auth';
import SubscribersController from './controllers/Subscribers';
import loginRoutes from './routes/login';
import usersRoutes from './routes/users';
import campaignsRoutes from './routes/campaigns';
import listsRoutes from './routes/lists';
import subscribersRoutes from './routes/subscribers';
import settingsRoutes from './routes/settings';
import CampaignsController from './controllers/Campaigns';
import queue from './utils/queue';
import transporter from './utils/transporter';

/*
* Queue Jobs
*/

queue.process(`sendEmail`, 10, (job, done) => {
  transporter.sendMail(job.data, (err, info) => {
    if (!err) {
      done();
    }
  });
});

queue.process('importCsv', (job, done) => {
  const filePath = __dirname + '/../' + job.data.filePath;
  const listId = job.data.listId;

  fs
    .createReadStream(filePath)
    .pipe(csv())
    .on('data', async data => {
      queue
        .create('importSubscriber', {
          title: 'Import subscriber',
          body: {
            emailAddress: data[0],
            listId: listId,
          },
        })
        .save(err => {
          if (!err) {
            console.log(`Queued subscriber import ${job.id}`);
          }
        });
    })
    .on('end', function() {
      console.log('done');
      done();
    });
});

queue.process('importSubscriber', 10, async (job, done) => {
  const createResult = await SubscribersController.create(job.data);

  if (createResult) {
    done();
  }
});

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const PORT = 8080 || process.env.PORT;
const app = express();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: process.env.JWT_SIG,
};

const authStrategy = new JwtStrategy(jwtOptions, async (jwt, next) => {
  console.log('auth strategy');
  try {
    console.log('...trying');
    const tokenIsValid = await AuthController.checkToken(jwt);

    if (!tokenIsValid) {
      throw new Error('Unauthorized');
    }

    next(null, tokenIsValid);
  } catch (e) {
    console.log('we got an error ', e.toString());
    next(null, false);
  }
});

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use(passport.initialize());
passport.use(authStrategy);

app.get('/api', (req, res) => {
  res.send('OpenMail API');
});

app.use('/api/login', loginRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/subscribers', subscribersRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
  if (process.env.NODE_ENV === 'development') {
    console.log('Kue running on port 8081');
    kue.app.listen(8081);
  }
});

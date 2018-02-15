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
import db from './utils/db';
import getMetric, { findStatFromReduced } from './utils/getMetric';

/*
* Queue Jobs
*/

queue.process('createReport', async (job, done) => {
  try {
    let campaignResult = await db
      .select('createdAt')
      .where({
        id: job.data.campaignId,
      })
      .from('campaigns');

    let reportId = await db
      .insert({
        status: 'sending',
        opens: 0,
        deliveries: 0,
        rejects: 0,
        bounces: 0,
        complaints: 0,
        clicks: 0,
        campaignId: job.data.campaignId,
      })
      .into('reports');

    let updateCampaignWithReportId = await db('campaigns')
      .update({
        reportId: reportId,
      })
      .where({
        id: job.data.campaignId,
      });

    /*
    * TODO: Replace this setInterval rubbish with proper task scheduling.
    * Should collect stats for a campaign every 5-15 minutes for 3 days after the campaign was sent.
    */
    setInterval(() => {
      Promise.all([
        getMetric('Click', new Date(campaignResult[0].createdAt), job.data.campaignId),
        getMetric('Open', new Date(campaignResult[0].createdAt), job.data.campaignId),
        getMetric('Delivery', new Date(campaignResult[0].createdAt), job.data.campaignId),
        getMetric('Bounce', new Date(campaignResult[0].createdAt), job.data.campaignId),
        getMetric('Complaint', new Date(campaignResult[0].createdAt), job.data.campaignId),
      ]).then(async result => {
        // Map over each result from CloudWatch and reduce all of the event sums
        let reducedStats = result.map(data => {
          return data.Datapoints.reduce((a, b) => {
            return {
              label: data.Label,
              count: a + b.Sum,
            };
          }, 0);
        });

        // Update the database with the reduced stats
        let res = await db('reports')
          .update({
            clicks: findStatFromReduced(reducedStats, 'Click'),
            opens: findStatFromReduced(reducedStats, 'Open'),
            deliveries: findStatFromReduced(reducedStats, 'Delivery'),
            bounces: findStatFromReduced(reducedStats, 'Bounce'),
            complaints: findStatFromReduced(reducedStats, 'Complaint'),
          })
          .where({
            id: reportId,
          });
      });
    }, 10000);

    done();
  } catch (e) {
    done(e);
  }
});

queue.process('sendEmail', 10, (job, done) => {
  transporter.sendMail(
    {
      headers: {
        'X-SES-CONFIGURATION-SET': 'marketing_statistics',
        'X-SES-MESSAGE-TAGS': `campaign=${job.data.campaignId}`,
      },
      ...job.data,
    },
    (err, info) => {
      if (!err) {
        done();
      } else {
        done(err);
      }
    },
  );
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
        .save(err => {});
    })
    .on('end', () => {
      console.log('Queued CSV for import');
      done();
    });
});

queue.process('importSubscriber', 10, async (job, done) => {
  try {
    const createResult = await SubscribersController.create(job.data);

    if (createResult) {
      done();
    }
  } catch (e) {
    done(e);
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
  try {
    const tokenIsValid = await AuthController.checkToken(jwt);

    if (!tokenIsValid) {
      throw new Error('Unauthorized');
    }

    next(null, tokenIsValid);
  } catch (e) {
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

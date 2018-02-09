import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import AuthController from './controllers/Auth';
import loginRoutes from './routes/login';
import usersRoutes from './routes/users';
import campaignsRoutes from './routes/campaigns';

const PORT = 8080 || process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.get('/api', (req, res) => {
  res.send('OpenMail API');
});

app.use('/api/login', loginRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/campaigns', campaignsRoutes);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

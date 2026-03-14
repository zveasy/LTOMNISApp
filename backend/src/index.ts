import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import {initializeDatabase} from './database';
import {startScheduler} from './utils/scheduler';
import logger from './utils/logger';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import identityRoutes from './routes/identity';
import scoreRoutes from './routes/score';
import communityRoutes from './routes/community';
import postsRoutes from './routes/posts';
import offersRoutes from './routes/offers';
import contractsRoutes from './routes/contracts';
import disputesRoutes from './routes/disputes';
import ledgerRoutes from './routes/ledger';
import paymentRoutes from './routes/payment';
import riskRoutes from './routes/risk';
import adminRoutes from './routes/admin';
import loanRoutes from './routes/loan';
import notificationsRoutes from './routes/notifications';

const app = express();
const PORT = process.env.PORT || 8080;

const authLimiter = rateLimit({windowMs: 15 * 60 * 1000, max: 20, message: {error: 'Too many attempts, try again later'}});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use((req, res, next) => {
  logger.info({method: req.method, url: req.url}, 'request');
  next();
});

initializeDatabase();
startScheduler();

const api = express.Router();
api.use('/account', authLimiter);
api.use(authRoutes);
api.use(userRoutes);
api.use(identityRoutes);
api.use(scoreRoutes);
api.use(communityRoutes);
api.use(postsRoutes);
api.use(offersRoutes);
api.use(contractsRoutes);
api.use(disputesRoutes);
api.use(ledgerRoutes);
api.use(paymentRoutes);
api.use(riskRoutes);
api.use(loanRoutes);
api.use(notificationsRoutes);
api.use(adminRoutes);

app.use('/api/omnis', api);

app.get('/health', (_req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info({port: PORT}, 'OMNIS backend started');
  });
}

export default app;

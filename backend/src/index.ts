import express from 'express';
import cors from 'cors';
import path from 'path';
import {initializeDatabase} from './database';

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

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

initializeDatabase();

const api = express.Router();
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
api.use(adminRoutes);
api.use(loanRoutes);

app.use('/api/omnis', api);

app.get('/health', (_req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

app.listen(PORT, () => {
  console.log(`OMNIS backend running on port ${PORT}`);
});

export default app;

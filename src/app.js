import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import viewRoutes from './routes/viewRoutes.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = express();

app.set('trust proxy', 1);
app.set('views', path.join(projectRoot, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(projectRoot, 'public')));

app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('error', {
    message: 'The page you requested could not be found.',
    error: { status: 404 }
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('error', {
    message: err.status ? err.message : 'Something went wrong. Please try again later.',
    error: { status: err.status || 500 }
  });
});

export default app;

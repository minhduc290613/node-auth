import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import viewRoutes from './src/routes/viewRoutes.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount Routes
app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
import express from "express";
import authRoutes from './auth.js';
import eventRoutes from './events.js';

const app = express.Router();

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);


export default app;

import express from "express";
import authRoutes from './auth.js';
import eventRoutes from './events.js';
import subscriptionRoutes from './subscriptions.js';

const app = express.Router();

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/subscriptions', subscriptionRoutes);


export default app;

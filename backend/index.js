import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with {type: 'json'}
import mongoose from 'mongoose';
import morgan from 'morgan';
import crypto from 'crypto'
import cors from 'cors'

import { sequelize } from './src/sequilize.js'

import { router as ordersRouter } from './src/orders/orders.router.js'
import { router as reviewsRouter } from './src/reviews/reviews.router.js'
import { router as servicesRouter } from './src/services/services.router.js'
import { router as usersRouter } from './src/users/users.router.js'
import { router as authRouter } from './src/auth/auth.router.js'
import { initializeRelations } from './src/utils.js'
import { HttpLog } from './src/logger/http-log.model.js';
import { validateRole } from './src/middlewares/validate-role.middleware.js';

dotenv.config();

export const app = express()
const port = process.env.PORT || 3000

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

morgan.token('response-time-ms', (req, res) => {
  const diff = process.hrtime(req._startAt);
  return diff ? Math.round((diff[0] * 1e3) + (diff[1] * 1e-6)) : 0;
});

app.use(morgan((tokens, req, res) => {
  const log = {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: parseInt(tokens.status(req, res), 10),
    responseTime: parseFloat(tokens['response-time-ms'](req, res)),
    timestamp: new Date(),
  };
  
  // HttpLog.create(log).catch(err => console.error('Failed to save HTTP log:', err));
  
  return JSON.stringify(log); // Optionally log to console
}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use('/auth', authRouter)

app.use(passport.authenticate("jwt", { session: false }))

app.use((req, res, next) => {
  if (req.headers.authorization) {
    let tokenParts = req.headers.authorization
        .split(' ')[1]
        .split('.');
    
    let signature = crypto
        .createHmac('SHA256', process.env.JWT_SECRET)
        .update(`${tokenParts[0]}.${tokenParts[1]}`)
        .digest('base64');

    if (signature === tokenParts[2])
        req.user = JSON.parse(
            Buffer.from(
                tokenParts[1],
                'base64'
            ).toString('utf8')
        );

    next();
    return;
  }
  
  next();
});

app.use('/users', validateRole('Admin'), usersRouter)
app.use('/orders', ordersRouter)
app.use('/reviews', reviewsRouter)
app.use('/services', servicesRouter)

app.listen(port, async () => {
  try {
    initializeRelations()
    await sequelize.authenticate()
    console.log('Database connected successfully.');

    await sequelize.sync({ force: false });
    console.log('Models synchronized with the database.');

    // if (process.env.MONGO_URI) {
    //   await mongoose.connect(process.env.MONGO_URI);
    //   console.log('Connected to MongoDB for logging.');
    // }
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }

  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});
import express from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import jwt from 'jsonwebtoken'
import Joi from 'joi'

import { User } from '../users/models/user.model.js';
import { validateRequest } from '../middlewares/validation.middleware.js'
import { AuthController } from './auth.controller.js';

dotenv.config();

const authOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new Strategy(authOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(Number(payload.id));
      if (user) return done(null, user);

      return done(null, false)
    } catch (error) {
      return done(error, false);
    }
  })
);

export const router = express.Router()

const authController = new AuthController()

const loginValidationSchema = Joi.object({
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required()
})

const createUserValidationSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(4),
  email: Joi.string().email().required()
})

router.post("/login", validateRequest(loginValidationSchema), async (request, response, next) => authController.login(request, response, next))
router.post("/register", validateRequest(createUserValidationSchema), async (request, response) => authController.register(request, response));

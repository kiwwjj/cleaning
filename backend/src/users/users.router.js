import express from 'express'

import Joi from 'joi'
import { validateRequest } from '../middlewares/validation.middleware.js'
import { UsersController } from './users.controller.js';

export const router = express.Router()

const usersController = new UsersController();

const createUserValidationSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(4),
  email: Joi.string().email().required()
})

const updateUserValidationSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email()
})

router.get('/', (request, response) => usersController.getAll(request, response))
router.get('/:id', (request, response) => usersController.getById(request, response))
router.post('/', validateRequest(createUserValidationSchema), (request, response) => usersController.create(request, response))
router.patch('/:id', validateRequest(updateUserValidationSchema), (request, response) => usersController.update(request, response))
router.delete('/:id', (request, response) => usersController.delete(request, response))

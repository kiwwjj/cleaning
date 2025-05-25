import express from 'express'
import { validateRequest } from '../middlewares/validation.middleware.js';
import Joi from 'joi';
import { validateRole } from '../middlewares/validate-role.middleware.js';
import { ServicesController } from './services.controller.js';

export const router = express.Router()

const servicesController = new ServicesController()

const createServiceValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  price_per_square_meter: Joi.number().positive(),
  additional_options: Joi.string()
})

const updateServiceValidationSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number().positive(),
  price_per_square_meter: Joi.number().positive(),
  additional_options: Joi.string()
})

router.get('/', async (request, response) => servicesController.getAll(request, response))
router.get('/:id', async (request, response) => servicesController.getById(request, response))
router.post('/', validateRole('Admin'), validateRequest(createServiceValidationSchema), async (request, response) => servicesController.create(request, response))
router.patch('/:id', validateRole('Admin'), validateRequest(updateServiceValidationSchema), async (request, response) => servicesController.update(request, response))
router.delete('/:id', validateRole('Admin'), async (request, response) => servicesController.delete(request, response))

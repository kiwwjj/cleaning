import express from 'express'
import Joi from 'joi'
import { validateRequest } from '../middlewares/validation.middleware.js'
import { validateRole } from '../middlewares/validate-role.middleware.js'
import { OrdersController } from './orders.controller.js'

const ordersController = new OrdersController();

export const router = express.Router()

const createOrderValidationSchema = Joi.object({
  user_id: Joi.number().required(),
  service_id: Joi.number().required(),
  order_date: Joi.date().required(),
  status: Joi.string().required()
})

const updateOrderValidationSchema = Joi.object({
  user_id: Joi.number(),
  service_id: Joi.number(),
  order_date: Joi.date(),
  status: Joi.string()
})

router.get('/', async (request, response) => ordersController.getAll(request, response))
router.get('/:id', async (request, response) => ordersController.getById(request, response))
router.post('/', validateRequest(createOrderValidationSchema), async (request, response) => ordersController.create(request, response))
router.patch('/:id', validateRole('Admin'), validateRequest(updateOrderValidationSchema), async (request, response) => ordersController.update(request, response))
router.delete('/:id', async (request, response) => ordersController.delete(request, response))

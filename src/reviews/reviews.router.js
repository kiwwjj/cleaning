import express from 'express'
import { Review } from './models/review.model.js'
import { validateRequest } from '../middlewares/validation.middleware.js';
import Joi from 'joi';
import { validateRole } from '../middlewares/validate-role.middleware.js';
import { ReviewsController } from './reviews.controller.js';

export const router = express.Router()

const reviewsController = new ReviewsController();

const createReviewValidationSchema = Joi.object({
  user_id: Joi.number().required(),
  service_id: Joi.number().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required()
})

const updateReviewValidationSchema = Joi.object({
  user_id: Joi.number(),
  service_id: Joi.number(),
  rating: Joi.number().min(1).max(5),
  comment: Joi.string()
})

router.get('/', async (request, response) => reviewsController.getAll(request, response))
router.get('/:id', async (request, response) => reviewsController.getById(request, response))
router.post('/', validateRequest(createReviewValidationSchema), async (request, response) => reviewsController.create(request, response))
router.patch('/:id', validateRole('Admin'), validateRequest(updateReviewValidationSchema), async (request, response) => reviewsController.update(request, response))
router.delete('/:id', validateRole('Admin'), async (request, response) => reviewsController.delete(request, response))

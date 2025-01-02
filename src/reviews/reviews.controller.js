import { ReviewsService } from "./reviews.service.js";

export class ReviewsController {
  constructor() {
    this.reviewsService = new ReviewsService();
  }

  async getAll(request, response) {
    const allReviews = await this.reviewsService.findAll();
    
    return response.json(allReviews)
  }

  async getById(request, response) {
    const id = Number.parseInt(request.params.id);
    if (!id) {
      return response.status(400).json({message: `Incorrect id ${id}`})
    }
  
    const review = await this.reviewsService.findById(id)
  
    if (!review) {
      return response.status(404).json({message: `Not found`})
    }
  
    return response.json(review)
  }

  async create(request, response) {
    try {
      const { rating } = request.body 
      const parsedRating = Number.parseInt(request.body.rating)
      if (parsedRating != rating || parsedRating < 1 || parsedRating > 5) {
        return response.status(400).json({message: `Incorrect field: ${rating}`})
      }
  
      const createdReview = await this.reviewsService.create({
        ...request.body,
        rating: parsedRating,
      })
  
      response.status(201).json(createdReview)
    } catch (err) {
      console.error(err)
  
      response.status(500).json({message: "Failed to create"})
    }
  }

  async update(request, response) {
    const id = Number.parseInt(request.params.id);
    if (!id) {
      return response.status(400).json({message: `Incorrect id ${id}`})
    }
  
    const updated = await this.reviewsService.update(id, request.body)
  
    if (!updated) {
      return response.status(404).json({message: `Not found`})
    }
  
    return response.status(200).json(updated)
  }

  async delete(request, response) {
    const id = Number.parseInt(request.params.id);
    if (!id) {
      return response.status(400).json({message: `Incorrect id ${id}`})
    }
  
    await this.reviewsService.delete(id)
  
    return response.status(200).json()
  }
}
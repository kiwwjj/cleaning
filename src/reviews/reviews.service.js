import { BaseService } from "../baseService.js";
import { Review } from "./models/review.model.js";

export class ReviewsService extends BaseService {
  constructor() {
    super(Review)
  }
}
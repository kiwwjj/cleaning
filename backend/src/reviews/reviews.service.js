import { BaseService } from "../baseService.js";
import { Review } from "./models/review.model.js";
import { User } from '../users/models/user.model.js';
import { Service } from '../services/models/service.model.js';

export class ReviewsService extends BaseService {
  constructor() {
    super(Review)
  }

  async findAll(options = {}) {
    return super.findAll({
      ...options,
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        },
        {
          model: Service,
          attributes: ['id', 'name']
        }
      ]
    });
  }

  async findById(id) {
    return super.findById(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        },
        {
          model: Service,
          attributes: ['id', 'name']
        }
      ]
    });
  }
}
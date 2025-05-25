import { BaseService } from '../baseService.js';
import { Order } from './models/order.model.js';
import { User } from '../users/models/user.model.js';
import { Service } from '../services/models/service.model.js';

export class OrdersService extends BaseService {
  constructor() {
    super(Order);
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

  async create(createOrderInput, service, userId) {
    const {service_id, order_date, status, squares} = createOrderInput;

    let totalPrice = parseFloat(service.price);
    if (squares) {
      totalPrice = service.price_per_square_meter * squares;
    }

    return super.create({service_id, order_date, status, totalPrice, user_id: userId})
  }
}
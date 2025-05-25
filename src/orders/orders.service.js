import { BaseService } from '../baseService.js';
import { Order } from './models/order.model.js'

export class OrdersService extends BaseService {
  constructor() {
    super(Order);
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
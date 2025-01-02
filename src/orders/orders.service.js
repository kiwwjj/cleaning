import { BaseService } from '../baseService.js';
import { Order } from './models/order.model.js'

export class OrdersService extends BaseService {
  constructor() {
    super(Order);
  }
}
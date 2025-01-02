import { OrdersService } from "./orders.service.js";

export class OrdersController {
  constructor() {
    this.ordersService = new OrdersService();
  }

  async getAll(request, response) {
    const user = request.user;

    let allOrders = null;
    if (user.role === 'Admin') {
      allOrders = await this.ordersService.findAll();
    } else {
      allOrders = await this.ordersService.findAll({where: {user_id: user.id}});
    }
    
    return response.json(allOrders)
  }

  async getById(request, response) {
    const id = Number.parseInt(request.params.id);
    if (!id) {
      return response.status(400).json({message: `Incorrect id ${id}`})
    }

    const order = await this.ordersService.findById(id)

    if (!order) {
      return response.status(404).json({message: `Not found`})
    }

    if (request.user.role !== 'Admin' && order.user_id !== request.user.id) {
      return response.status(404).json({message: `Not found`})
    }

    return response.json(order)
  }

  async create(request, response) {
    try {
      const createdOrder = await this.ordersService.create(request.body)
  
      response.status(201).json(createdOrder)
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

    const updated = await this.ordersService.update(id, request.body)

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
  
    await this.ordersService.delete(id)
  
    response.status(200).json()
  }
}
import { ServicesService } from "./services.service.js";

export class ServicesController {
  constructor() {
    this.servicesService = new ServicesService();
  }

  async getAll(request, response) {
    const services = await this.servicesService.findAll();

    return response.json(services);
  }

  async getById(request, response) {
    const id = Number.parseInt(request.params.id);
    if (!id) {
      return response.status(400).json({message: `Incorrect id ${id}`})
    }
  
    const service = await this.servicesService.findById(id)
  
    if (!service) {
      return response.status(404).json({message: `Not found`})
    }
  
    response.json(service)
  }

  async create(request, response) {
    try {
      const createdService = await this.servicesService.create(request.body)
  
      response.status(201).json(createdService)
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
  
    const updated = await this.servicesService.update(id, request.body)
  
    if (!updated) {
      return response.status(404).json({message: `Not found`})
    }
  
    response.status(200).json(updated)
  }

  async delete(request, response) {
    const id = Number.parseInt(request.params.id);
    if (!id) {
      return response.status(400).json({message: `Incorrect id ${id}`})
    }
  
    await this.servicesService.delete(id)
  
    response.status(200).json()
  }
}
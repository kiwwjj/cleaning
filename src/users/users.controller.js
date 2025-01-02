import { UsersService } from "./users.service.js";

export class UsersController {
  constructor() {
    this.usersService = new UsersService();
  }

  async getAll(request, response) {
    const users = await this.usersService.findAll();

    return response.json(users);
  }

  async getById(request, response) {
    const id = Number.parseInt(request.params.id);
    
    if (!id) {
      return response.status(400).json({message: `Incorrect id ${id}`})
    }
  
    const user = await usersService.findById(id);
  
    if (!user) {
      return response.status(404).json({message: `Not found`})
    }
  
    return response.json(user)
  }

  async create(request, response) {
    try {
      const createdUser = await usersService.create(request.body)
  
      response.status(201).json({name: createdUser.name, email: createdUser.email})
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
  
    const updated = await usersService.update(id, request.body);
  
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
  
    await usersService.delete(id);
  
    response.status(200).json()
  }
}
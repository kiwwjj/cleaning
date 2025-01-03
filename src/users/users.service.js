import bcrypt from 'bcrypt'
import { BaseService } from '../baseService.js';
import { User } from './models/user.model.js';

export class UsersService extends BaseService {
  constructor() {
    super(User);
  }

  async findAll() {
    return super.findAll({ attributes: { exclude: 'password'} })
  }

  async findById(id) {
    return super.findById(id, { attributes: { exclude: 'password' } })
  }

  async findByEmail(email) {
    return User.findOne({ where: { email: email } })
  }

  async update(id, updateUserInput) {
    return super.update(id, updateUserInput, {attributes: {exclude: 'password'}})
  }
}
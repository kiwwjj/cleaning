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

  async create(createUserInput) {
    const {name, email, password} = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    return super.create({name, email, password: hashedPassword})
  }

  async update(id, updateUserInput) {
    return super.update(id, updateUserInput, {attributes: {exclude: 'password'}})
  }
}
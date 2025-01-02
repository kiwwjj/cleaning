import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { UsersService } from "../users/users.service.js";

export class AuthController {
  constructor() {
    this.usersService = new UsersService()
  }

  async login(request, response, next) {
    try {
      // check if user exists
      const userExists = await this.usersService.findByEmail(request.body.email);
      if (!userExists) {
        return response.status(400).json({ message: "Incorrect email or password" });
      }
  
      // check if password is correct
      const isValidPassword = await bcrypt.compare(request.body.password, userExists.password);
      if (!isValidPassword) {
        return response.status(400).json({ message: "Incorrect email or password" });
      }
  
      // generate access token
      const accessToken = jwt
        .sign(
          {
            email: userExists.email,
            id: userExists.id,
            role: userExists.role
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        )
  
      return response
        .status(200)
        .json({ message: "user logged in", accessToken: accessToken });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async register(request, response) {
    try {
      const {name, email, password} = request.body;
  
      const hashedPassword = await bcrypt.hash(password, 10)
      const createdUser = await this.usersService.create({name, email, password: hashedPassword, role: 'Client'})
  
      response.status(201).json({name: createdUser.name, email: createdUser.email})
    } catch (err) {
      console.error(err)
  
      response.status(500).json({message: "Failed to create"})
    }
  }
}
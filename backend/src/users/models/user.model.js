import { DataTypes, Model } from 'sequelize'

import { sequelize } from '../../sequilize.js';

export class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ['Client', 'Admin'],
    allowNull: false,
    defaultValue: 'Client'
  }
}, { sequelize, modelName: 'User', tableName: 'User', timestamps: false });

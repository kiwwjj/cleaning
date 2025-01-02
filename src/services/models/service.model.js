import { DataTypes, Model } from 'sequelize'

import { sequelize } from '../../sequilize.js';

// Модель Service
export class Service extends Model {}
Service.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.NUMERIC(10, 2),
  },
  price_per_square_meter: {
    type: DataTypes.NUMERIC(10, 2),
  },
  additional_options: {
    type: DataTypes.TEXT,
  },
}, { sequelize, modelName: 'Service', tableName: 'Service', timestamps: false });

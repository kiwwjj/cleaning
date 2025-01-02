import { DataTypes, Model } from 'sequelize'

import { sequelize } from '../../sequilize.js';

import { User } from '../../users/models/user.model.js';
import { Service } from '../../services/models/service.model.js';

// Модель Order
export class Order extends Model {}
Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id',
    },
  },
  order_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.TEXT,
  },
}, { sequelize, modelName: 'Order', tableName: 'Order', timestamps: false });

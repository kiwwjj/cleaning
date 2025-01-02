import { DataTypes, Model } from 'sequelize'

import { sequelize } from '../../sequilize.js';
import { User } from '../../users/models/user.model.js';
import { Service } from '../../services/models/service.model.js';

// Модель Review
export class Review extends Model {}
Review.init({
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
  rating: {
    type: DataTypes.INTEGER,
  },
  comment: {
    type: DataTypes.TEXT,
  },
}, { sequelize, modelName: 'Review', tableName: 'Review', timestamps: false });

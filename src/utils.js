import { User } from './users/models/user.model.js';
import { Review } from './reviews/models/review.model.js';
import { Order } from './orders/models/order.model.js';
import { Service } from './services/models/service.model.js';
  

export const initializeRelations = () => {
  User.hasMany(Order, { foreignKey: 'user_id' });
  Order.belongsTo(User, { foreignKey: 'user_id' });
  
  Service.hasMany(Order, { foreignKey: 'service_id' });
  Order.belongsTo(Service, { foreignKey: 'service_id' });
  
  User.hasMany(Review, { foreignKey: 'user_id' });
  Review.belongsTo(User, { foreignKey: 'user_id' });
  
  Service.hasMany(Review, { foreignKey: 'service_id' });
  Review.belongsTo(Service, { foreignKey: 'service_id' });
  
}
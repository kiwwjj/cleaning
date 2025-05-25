import { DbLog } from './db-log.model.js';

export const logSequelizeQuery = async (sql, operation, modelName, success, error = null) => {
  try {
    // await DbLog.create({
    //   operation,
    //   model: modelName,
    //   data: sql, // Сохраняем сам запрос
    //   success,
    //   error,
    // });
  } catch (err) {
    console.error('Failed to log database operation:', err);
  }
};

import { Sequelize, DataTypes, Model } from 'sequelize'
import dotenv from 'dotenv';

dotenv.config()

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME
import { DbLog } from './logger/db-log.model.js';

export const sequelize = new Sequelize(`postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`, {
  database: dbName,
  // logging: async (sql) => {
  //   try {
  //     await DbLog.create({
  //       operation: 'query',
  //       model: 'global', 
  //       data: sql, 
  //       success: true,
  //     });
  //   } catch (err) {
  //     console.error('Failed to log SQL query:', err);
  //   }
  // },
});

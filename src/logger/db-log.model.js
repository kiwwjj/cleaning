import mongoose from 'mongoose';

const dbLogSchema = new mongoose.Schema({
  operation: { type: String, required: true }, // Тип операции: create, read, update, delete
  model: { type: String, required: true }, // Модель, на которой выполнялась операция
  data: { type: mongoose.Schema.Types.Mixed }, // Данные операции
  timestamp: { type: Date, default: Date.now }, 
  success: { type: Boolean, required: true }, 
  error: { type: String }, 
});

export const DbLog = mongoose.model('DbLog', dbLogSchema);

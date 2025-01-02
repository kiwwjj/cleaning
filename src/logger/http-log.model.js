import mongoose from 'mongoose';

const httpLogSchema = new mongoose.Schema({
  method: { type: String, required: true },
  url: { type: String, required: true },
  status: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const HttpLog = mongoose.model('HttpLog', httpLogSchema);

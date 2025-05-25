import api from './api';
import type { Order, CreateOrderInput, UpdateOrderInput } from '../types';

export const ordersService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async create(data: CreateOrderInput): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  async update(id: number, data: UpdateOrderInput): Promise<Order> {
    const response = await api.patch(`/orders/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/orders/${id}`);
  }
}; 
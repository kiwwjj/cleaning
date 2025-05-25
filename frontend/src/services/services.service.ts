import api from './api';
import type { Service, CreateServiceInput, UpdateServiceInput } from '../types';

export const servicesService = {
  async getAll(): Promise<Service[]> {
    const response = await api.get('/services');
    return response.data;
  },

  async getById(id: number): Promise<Service> {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async create(data: CreateServiceInput): Promise<Service> {
    const response = await api.post('/services', data);
    return response.data;
  },

  async update(id: number, data: UpdateServiceInput): Promise<Service> {
    const response = await api.patch(`/services/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/services/${id}`);
  }
}; 
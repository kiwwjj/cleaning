import api from './api';
import type { Review, CreateReviewInput, UpdateReviewInput } from '../types';

export const reviewsService = {
  async getAll(): Promise<Review[]> {
    const response = await api.get('/reviews');
    return response.data;
  },

  async getById(id: number): Promise<Review> {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  async create(data: CreateReviewInput): Promise<Review> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async update(id: number, data: UpdateReviewInput): Promise<Review> {
    const response = await api.patch(`/reviews/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/reviews/${id}`);
  }
}; 
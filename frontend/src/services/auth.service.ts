import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';
import { UserRole } from '../types';
import api from './api';

interface DecodedToken {
  email: string;
  id: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<{ user: User }> {
    const response = await api.post('/auth/login', credentials);

    if (!response.data.accessToken) {
      throw new Error('Login failed');
    }

    localStorage.setItem('token', response.data.accessToken);

    // Decode token to get user info
    const decodedToken = jwtDecode<DecodedToken>(response.data.accessToken);
    const user: User = {
      id: decodedToken.id,
      email: decodedToken.email,
      name: '', // We don't have name in token, might need to fetch it separately
      role: decodedToken.role
    };

    return { user };
  },

  async register(data: { name: string; email: string; password: string }): Promise<{ user: User }> {
    const response = await api.post('/auth/register', data);

    if (!response.data) {
      throw new Error('Registration failed');
    }

    // After registration, we need to login to get the token
    return this.login({ email: data.email, password: data.password });
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  },

  getCurrentToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    const token = this.getCurrentToken();
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  }
}; 
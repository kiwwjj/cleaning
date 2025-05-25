import api from './api';
import type { User } from '../types';
import { UserRole } from '../types';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  id: string;
  role: string;
  exp: number;
  iat: number;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.accessToken;
    const decoded = jwtDecode<DecodedToken>(token);
    
    const user: User = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as UserRole,
      name: email.split('@')[0], // Fallback name from email
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/register', { name, email, password });
    const token = response.data.accessToken;
    const decoded = jwtDecode<DecodedToken>(token);
    
    const user: User = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as UserRole,
      name,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getCurrentToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}; 
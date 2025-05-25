export enum UserRole {
  Admin = 'Admin',
  Client = 'Client'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  price_per_square_meter: number;
  additional_options: string;
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  price: number;
  price_per_square_meter: number;
  additional_options: string;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {} 
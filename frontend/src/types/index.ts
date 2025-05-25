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

export interface Order {
  id: number;
  user_id: number;
  service_id: number;
  order_date: string;
  status: string;
  totalPrice: number;
  User?: {
    id: number;
    name: string;
  };
  Service?: {
    id: number;
    name: string;
  };
}

export interface CreateOrderInput {
  service_id: number;
  order_date: string;
  status: string;
  squares?: number;
}

export interface UpdateOrderInput extends Partial<CreateOrderInput> {}

export interface Review {
  id: number;
  user_id: number;
  service_id: number;
  rating: number;
  comment: string;
  User?: {
    id: number;
    name: string;
  };
  Service?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewInput {
  service_id: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewInput extends Partial<CreateReviewInput> {} 
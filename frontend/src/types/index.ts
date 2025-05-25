export const UserRole = {
  Admin: 'Admin',
  Client: 'Client'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
} 
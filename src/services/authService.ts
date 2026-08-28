import type { User, LoginCredentials, RegisterData } from '../types';
import { defaultUser } from '../data/users';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(credentials: LoginCredentials): Promise<User> {
  await delay(1000);
  const user: User = { ...defaultUser, email: credentials.email };
  localStorage.setItem('bis_user', JSON.stringify(user));
  return user;
}

export async function register(data: RegisterData): Promise<User> {
  await delay(1500);
  const user: User = {
    id: '1',
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    company: data.company,
    productCategory: data.productCategory,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=02499B&color=fff`,
  };
  localStorage.setItem('bis_user', JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  await delay(500);
  localStorage.removeItem('bis_user');
}

export function getCurrentUser(): User | null {
  try {
    const user = localStorage.getItem('bis_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

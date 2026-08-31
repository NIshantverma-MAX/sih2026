import type { UserSchema } from '@insforge/sdk';
import type { User, LoginCredentials, RegisterData, UserRole } from '../types';
import { defaultUser } from '../data/users';
import { getOAuthRedirectTo, insforge } from '../lib/insforge';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const userStorageKey = 'bis_user';

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function readRole(value: unknown): UserRole {
  return value === 'manufacturer' ||
    value === 'consumer' ||
    value === 'student' ||
    value === 'administrator'
    ? value
    : 'consumer';
}

function persistUser(user: User): User {
  localStorage.setItem(userStorageKey, JSON.stringify(user));
  return user;
}

export function mapInsForgeUser(authUser: UserSchema): User {
  const profile = authUser.profile ?? {};
  const metadata = authUser.metadata ?? {};
  const name =
    readString(profile.name) ??
    readString(metadata.name) ??
    authUser.email.split('@')[0] ??
    'BIS User';

  return {
    id: authUser.id,
    name,
    email: authUser.email,
    phone: readString(metadata.phone),
    role: readRole(metadata.role),
    company: readString(metadata.company),
    productCategory: readString(metadata.productCategory),
    avatar: readString(profile.avatar_url),
  };
}

export async function login(credentials: LoginCredentials): Promise<User> {
  if (insforge) {
    const { data, error } = await insforge.auth.signInWithPassword({
      method: 'password',
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    if (data?.user) {
      return persistUser(mapInsForgeUser(data.user));
    }
  }

  await delay(1000);
  const user: User = { ...defaultUser, email: credentials.email };
  return persistUser(user);
}

export async function loginWithGoogle(): Promise<void> {
  if (!insforge) {
    throw new Error('InsForge is not configured. Set VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY.');
  }

  const { error } = await insforge.auth.signInWithOAuth('google', {
    redirectTo: getOAuthRedirectTo(),
    additionalParams: { prompt: 'select_account' },
  });

  if (error) {
    throw error;
  }
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
  return persistUser(user);
}

export async function logout(): Promise<void> {
  if (insforge) {
    await insforge.auth.signOut();
  } else {
    await delay(500);
  }
  localStorage.removeItem(userStorageKey);
}

export function getCurrentUser(): User | null {
  try {
    const user = localStorage.getItem(userStorageKey);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export async function hydrateCurrentUser(): Promise<User | null> {
  if (!insforge) {
    return getCurrentUser();
  }

  const { data, error } = await insforge.auth.getCurrentUser();

  if (error || !data.user) {
    localStorage.removeItem(userStorageKey);
    return null;
  }

  return persistUser(mapInsForgeUser(data.user));
}

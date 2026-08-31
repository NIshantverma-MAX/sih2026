import { createClient } from '@insforge/sdk';

const defaultInsForgeUrl = 'https://9fvw7gmi.ap-southeast.insforge.app';
const insforgeUrl = import.meta.env.VITE_INSFORGE_URL?.trim() || defaultInsForgeUrl;
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY?.trim();

export const isInsForgeConfigured = Boolean(insforgeUrl);

export const insforge = isInsForgeConfigured
  ? createClient({
      baseUrl: insforgeUrl,
      anonKey: insforgeAnonKey || undefined,
      auth: {
        detectOAuthCallback: true,
      },
    })
  : null;

export function getOAuthRedirectTo(): string {
  return `${window.location.origin}/`;
}

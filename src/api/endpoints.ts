const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
    throw new Error('VITE_API_URL is not defined. Check your .env files.');
}
export const ENDPOINTS = {
    register: `${API_URL}/api/auth/register`,
    login: `${API_URL}/api/auth/login`
} as const;
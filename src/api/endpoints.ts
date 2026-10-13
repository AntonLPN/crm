const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
if (!API_URL) {
    throw new Error('VITE_API_URL is not defined. Check your .env files.');
}
if (!API_KEY) {
    throw new Error('VITE_API_KEY is not defined. Check your .env files.');
}
export const ENDPOINTS = {
    ping: `${API_URL}/ping`,
    register: `${API_URL}/api/auth/register`,
    login: `${API_URL}/api/auth/login`
} as const;
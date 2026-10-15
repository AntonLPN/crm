import {ENDPOINTS} from '../endpoints'
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import type {RegistrationData, RegisterRequest, LoginRequest} from './types';

const REGISTER_URL = ENDPOINTS.register;
const PING_URL = ENDPOINTS.ping;
let accessToken: string | null = null;
let sessionRefreshPromise: Promise<string | null> | undefined;
let authSessionGeneration = 0;

class ApiError extends Error {
    constructor(public status: number, message: string) {   // public в конструкторе = автосвойство
        super(message);
    }
}

export type RegistrationErrorCode =
    | 'invalidPhone'
    | 'invalidCredentials'
    | 'userAlreadyExists'
    | 'serverError'
    | 'networkError';

export type LoginErrorCode =
    | 'invalidCredentials'
    | 'mfaRequired'
    | 'serverError'
    | 'networkError';


export class RegistrationError extends Error {
    constructor(public code: RegistrationErrorCode) {
        super(code);
        this.name = 'RegistrationError';
    }
}

export class LoginError extends Error {
    constructor(public code: LoginErrorCode) {
        super(code);
        this.name = 'LoginError';
    }
}

export class SessionRefreshError extends Error {
    constructor() {
        super('Could not verify the current session.');
        this.name = 'SessionRefreshError';
    }
}

export class AuthenticationRequiredError extends Error {
    constructor() {
        super('An authenticated session is required for this request.');
        this.name = 'AuthenticationRequiredError';
    }
}

async function performSessionRefresh(): Promise<string | null> {
    const antiforgeryResponse = await fetch(ENDPOINTS.antiforgery, {
        method: 'GET',
        credentials: 'include',
        headers: {'Accept': 'application/json'}
    });
    if (!antiforgeryResponse.ok) {
        throw new SessionRefreshError();
    }

    let antiforgeryResult: unknown;
    try {
        antiforgeryResult = await antiforgeryResponse.json();
    } catch {
        throw new SessionRefreshError();
    }

    if (
        typeof antiforgeryResult !== 'object' ||
        antiforgeryResult === null ||
        !('requestToken' in antiforgeryResult) ||
        typeof antiforgeryResult.requestToken !== 'string'
    ) {
        throw new SessionRefreshError();
    }

    const response = await fetch(ENDPOINTS.refreshCookie, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': antiforgeryResult.requestToken
        }
    });

    if (response.status === 401) {
        return null;
    }
    if (!response.ok) {
        throw new SessionRefreshError();
    }

    let refreshResult: unknown;
    try {
        refreshResult = await response.json();
    } catch {
        throw new SessionRefreshError();
    }

    if (
        typeof refreshResult !== 'object' ||
        refreshResult === null ||
        !('accessToken' in refreshResult) ||
        typeof refreshResult.accessToken !== 'string' ||
        refreshResult.accessToken.length === 0
    ) {
        throw new SessionRefreshError();
    }

    return refreshResult.accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
    if (!sessionRefreshPromise) {
        const generation = authSessionGeneration;
        const refreshPromise = performSessionRefresh()
            .then((token) => {
                if (generation !== authSessionGeneration) {
                    return null;
                }
                accessToken = token;
                return token;
            })
            .finally(() => {
                if (sessionRefreshPromise === refreshPromise) {
                    sessionRefreshPromise = undefined;
                }
            });
        sessionRefreshPromise = refreshPromise;
    }
    return sessionRefreshPromise;
}

export async function refreshSession(): Promise<boolean> {
    return (await refreshAccessToken()) !== null;
}

export function clearAccessToken(): void {
    authSessionGeneration += 1;
    accessToken = null;
    sessionRefreshPromise = undefined;
}

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const baseRequest = new Request(input, {
        ...init,
        credentials: init.credentials ?? 'include'
    });

    const sendWithToken = (token: string): Promise<Response> => {
        const headers = new Headers(baseRequest.headers);
        headers.set('Authorization', `Bearer ${token}`);
        return fetch(new Request(baseRequest.clone(), {headers}));
    };

    const tokenUsed = accessToken ?? await refreshAccessToken();
    if (!tokenUsed) {
        throw new AuthenticationRequiredError();
    }

    const response = await sendWithToken(tokenUsed);
    if (response.status !== 401) {
        return response;
    }

    // Another request may already have refreshed this token while this response was in flight.
    const refreshedToken = accessToken !== tokenUsed
        ? accessToken
        : await refreshAccessToken();
    if (!refreshedToken) {
        return response;
    }

    return sendWithToken(refreshedToken);
}

export async function pingServer(): Promise<void> {
    try {
        const response = await fetch(PING_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`Error ping: ${response.status} ${response.statusText}`);
            return;
        }
        console.info('Ping successful');
    } catch (error) {
        console.error('Failed to execute ping:', error);
    }
}

async function register(data: RegisterRequest): Promise<void> {
    const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new ApiError(response.status, await response.text());

    }
}

export async function registerUser(data: RegistrationData): Promise<void> {
    const parsedPhone = parsePhoneNumberFromString(data.phone, data.country);
    if (!parsedPhone?.isValid()) {
        throw new RegistrationError('invalidPhone');
    }
    // await new Promise<void>((resolve) => setTimeout(resolve, 10_000)); //for debugging
    try {

        const request: RegisterRequest = {
            email: data.email,
            name: data.firstName,
            surname: data.lastName,
            phoneNumber: parsedPhone.number,
            password: data.password,
            metadata: {
                type: data.role
            }
        };

        await register(request);
    } catch (e) {
        if (e instanceof ApiError) {
            const code: RegistrationErrorCode = e.status === 401
                ? 'invalidCredentials'
                : e.status === 409
                    ? 'userAlreadyExists'
                    : 'serverError';
            throw new RegistrationError(code);
        }
        throw new RegistrationError('networkError');
    }

}


async function login(data: LoginRequest): Promise<void> {
    const response = await fetch(ENDPOINTS.login, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new ApiError(response.status, await response.text());
    }

    let result: unknown;
    try {
        result = await response.json();
    } catch {
        throw new LoginError('serverError');
    }

    if (
        typeof result !== 'object' ||
        result === null ||
        !('isMfaRequired' in result) ||
        typeof result.isMfaRequired !== 'boolean'
    ) {
        throw new LoginError('serverError');
    }

    if (result.isMfaRequired) {
        throw new LoginError('mfaRequired');
    }
}

export async function loginUser(data: LoginRequest): Promise<void> {
    if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(data.email)) {
        throw new LoginError('invalidCredentials');
    }

    try {
        await login(data);
    } catch (e) {
        if (e instanceof LoginError) {
            throw e;
        }
        if (e instanceof ApiError) {
            const code: LoginErrorCode = e.status === 400
                ? 'invalidCredentials'
                : 'serverError';
            throw new LoginError(code);
        }
        throw new LoginError('networkError');
    }
}

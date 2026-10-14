import {ENDPOINTS} from '../endpoints'
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import type {RegistrationData, RegisterRequest, LoginRequest} from './types';

const REGISTER_URL = ENDPOINTS.register;
const PING_URL = ENDPOINTS.ping;
let sessionRefreshPromise: Promise<boolean> | undefined;

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

async function performSessionRefresh(): Promise<boolean> {
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
        return false;
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

    return true;
}

export function refreshSession(): Promise<boolean> {
    if (!sessionRefreshPromise) {
        sessionRefreshPromise = performSessionRefresh().finally(() => {
            sessionRefreshPromise = undefined;
        });
    }
    return sessionRefreshPromise;
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

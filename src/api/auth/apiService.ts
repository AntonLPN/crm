import {ENDPOINTS} from '../endpoints'
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import type {RegistrationData, RegisterRequest, LoginRequest} from './types';

const REGISTER_URL = ENDPOINTS.register;
const PING_URL = ENDPOINTS.ping;

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

export async function loginUser(data: LoginRequest): Promise<void> {
    try {
        if (/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(data.email)) {
            await login(data);
        }
    } catch (e) {
        if (e instanceof ApiError) {
            const code: LoginErrorCode = e.status === 400
                ? 'invalidCredentials'
                : 'serverError';
            throw new LoginError(code);
        }
        throw new LoginError('networkError');
    }
}

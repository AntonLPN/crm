import {ENDPOINTS} from '../endpoints'
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import type {RegistrationData, RegisterRequest} from './types';

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

export class RegistrationError extends Error {
    constructor(public code: RegistrationErrorCode) {
        super(code);
        this.name = 'RegistrationError';
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


export async function register(data: RegisterRequest): Promise<void> {
    const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {                              // IsSuccessStatusCode
        throw new ApiError(response.status, await response.text());

    }
}

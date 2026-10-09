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
    // await new Promise<void>((resolve) => setTimeout(resolve, 10_000)); //for debugging
    try {
        const parsedPhone = parsePhoneNumberFromString(data.phone, data.country);
        if (!parsedPhone?.isValid()) {
            throw new Error('Enter a valid phone number');
        }


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
        if (e instanceof ApiError) {            // аналог catch (ApiException ex)
            switch (e.status) {
                case 401:
                    console.log('Error authentication');
                    break;
                case 409:
                    console.log('User already exists');
                    break;
                default:
                    console.log('Ошибка сервера');
            }
        } else {
            console.log('Сеть недоступна');     // fetch упал без ответа
        }
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


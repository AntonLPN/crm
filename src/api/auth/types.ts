import type {CountryCode} from 'libphonenumber-js';

export interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: CountryCode;
    password: string;
    role: 'admin' | 'doctor';
}

export interface RegisterRequest {
    email: string;
    name?: string | null;
    surname?: string | null;
    phoneNumber: string;
    password: string;
    referralCode?: string | null;
    metadata?: {
        type: string;
    } | null;
}
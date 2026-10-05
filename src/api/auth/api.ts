import type {RegistrationData} from '../../components/LoginRegComponents/RegisterForm';
import {ENDPOINTS} from '../endpoints'
import {RegisterRequest} from './types';



const REGISTER_URL = ENDPOINTS.register;

/**
 * Пример запроса регистрации.
 * Замените REGISTER_URL на адрес вашего API и при необходимости
 * адаптируйте тело запроса под формат, который ожидает сервер.
 */
export async function registerUser(data: RegistrationData): Promise<void> {
    const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Ошибка регистрации: ${response.status} ${response.statusText}`);
    }
}

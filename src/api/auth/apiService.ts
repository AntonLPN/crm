import type {RegistrationData} from '../../components/LoginRegComponents/RegisterForm';
import {ENDPOINTS} from '../endpoints'
import {RegisterRequest} from './types';

const REGISTER_URL = ENDPOINTS.register;
//тсандартный способ запроса
export async function register (data: RegisterRequest) {
    const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Ошибка регистрации: ${response.status} ${response.statusText}`);
    }
}

//Вызов — через React Query (useMutation)
// import { useMutation } from '@tanstack/react-query';
// import { register } from '@/api/auth';
//
// function RegisterForm() {
//     const mutation = useMutation({
//         mutationFn: register,
//         onSuccess: (data) => {
//             console.log('Успех:', data);
//         },
//         onError: (err) => {
//             console.error('Ошибка:', err);
//         },
//     });
//
//     const handleSubmit = () => {
//         mutation.mutate({
//             email: 'user@example.com',
//             name: 'string',
//             surname: 'string',
//             phoneNumber: 'string',
//             password: 'S1E-]Hu]9!Ki{1zJ}z\\o=/v]yVHcs*D{Qr9i.?]"`^?cU^H!{]XJVQuG_[%,cR|C)&pY`K4EoB1_v',
//             referralCode: 'string',
//         });
//     };
//
//     return (
//         <button onClick={handleSubmit} disabled={mutation.isPending}>
//         {mutation.isPending ? 'Отправка...' : 'Зарегистрироваться'}
//         </button>
// );
// }

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

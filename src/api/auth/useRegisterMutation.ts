import {useMutation} from '@tanstack/react-query';
import {registerUser} from './apiService';

export function useRegisterMutation() {
    return useMutation({
        mutationFn: registerUser
    });
}

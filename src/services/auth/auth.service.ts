import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { authService } from './auth.api';
import type { ILoginRequest, ILoginResponse } from './auth.types';

export const useLogin = (
  options?: UseMutationOptions<ILoginResponse, Error, ILoginRequest>
) => {
  return useMutation({
    mutationFn: authService.login,
    ...options,
  });
};
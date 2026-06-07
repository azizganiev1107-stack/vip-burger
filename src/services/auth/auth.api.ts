import { $host } from '@/api';
import type { ILoginRequest, ILoginResponse } from './auth.types';

export const authService = {
  login: async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const { data } = await $host.post<ILoginResponse>('/login', credentials);
    return data;
  }
};
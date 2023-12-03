import axios, { AxiosRequestConfig } from 'axios';
import { LocalStorage } from './utils';
import { CreateLoginResponse, CreateUserDto, LoginDto, LoginResponse } from '@/interfaces/interfaces';
import { ZodError, z } from 'zod';


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get('token') as string | null;

    // Make headers optional in AxiosRequestConfig
    config.headers = config.headers || {};

    // Manually set the Authorization header
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('user/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id', response.data.id);
    }

    CreateLoginResponse.parse(response.data);

    return response.data;
  } catch (error: any) {
    // You can customize this error handling based on the type of errors expected
    throw new Error('Erro durante o login: ' + error.message);
  }
};

export const registro = async (data: CreateUserDto) => {
  try {
    const response = await apiClient.post('user/register', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro durante o registro: ' + error);
  }
};

export const getUser = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.get(`user/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }
};

export const getUsers = async (params?: { skip?: number; take?: number }): Promise<any> => {
  try {
    const response = await apiClient.get('user', { params });
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }
};

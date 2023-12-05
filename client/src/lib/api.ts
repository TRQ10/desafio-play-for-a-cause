import axios from 'axios';
import { LocalStorage } from './utils';
import { CreateUserDto } from '@/interfaces/interfaces';
import { z } from 'zod';
import { url } from '@/app/api/auth/[...nextauth]/route';


export const apiClient = axios.create({
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

export const registro = async (data: CreateUserDto) => {
  try {
    const response = await apiClient.post('auth/register', data, {
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


export const getFriends = async (userId: number) => {
  const response = await fetch(`${url}/friends/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Adicione headers de autenticação, se necessário
    },
  });

  return response.json();
};

export const fetchPendingFriendRequests = async (userId: number) => {
  try {
    const response = await fetch(`${url}/friends/${userId}/friends/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      console.error('Falha ao obter os pedidos de amizade pendentes:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao obter os pedidos de amizade pendentes:', error);
  }
};


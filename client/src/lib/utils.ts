import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosResponse } from 'axios';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface ApiResponse<T> {
  success: boolean;
  data: T;
  // Add other properties if needed
}


export const requestHandler = async <T>(
  api: () => Promise<AxiosResponse<ApiResponse<T>>>, // Use ApiResponse<T> here
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: T) => void,
  onError: (error: string) => void
) => {
  setLoading && setLoading(true);

  try {
    const response = await api();
    const { data } = response;

    if (data?.success) {
      onSuccess(data.data);
    }
  } catch (error: any) {
    if ([401, 403].includes(error?.response?.data?.statusCode)) {
      LocalStorage.clear();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    onError(error?.response?.data?.message || 'Something went wrong');
  } finally {
    setLoading && setLoading(false);
  }
};

export class LocalStorage {
  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
}


export default function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

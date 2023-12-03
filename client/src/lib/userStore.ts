import { LoginResponse } from '@/interfaces/interfaces'
import { create } from 'zustand'

export const useStore = create<LoginResponse>((set) => ({
    id: 0,
    setId: (id: number) => set({ id: id }),
    token: "",
    setToken: (token: string) => set({ token: token })
}));
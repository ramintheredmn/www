'use client'
import { create } from 'zustand'
import axios from 'axios'


interface T {
    isLogin: boolean,
    makeLogin: (l: any)=> void,
    userLogedin: string
    changeUserLogedin: (user_id: string) => void
    role: Number | null
    changeRole: (role: number) => void
    fetcher: (u: string|null)=> void

}

export const useStore = create<T>()((set)=> ({
    isLogin: true,
    userLogedin: '1234567890',
    role: null,
    makeLogin: (l) => set(state => ({isLogin: true})),
    changeUserLogedin: (user_id) => set(state=> ({userLogedin: user_id})),
    changeRole: (n) => set(state => ({role: Number(n)})),
    fetcher : (url: any ) => axios.get(url).then(res => res.data)



}))


'use client'
import { create } from 'zustand'
import axios from 'axios'
import {DateObject} from 'react-multi-date-picker'


interface T {
    isLogin: boolean,
    makeLogin: (l: any)=> void,
    userLogedin: string,
    changeUserLogedin: (user_id: string) => void,
    role: Number | null,
    changeRole: (role: number) => void,
    fetcher: <DataType>(u: string|null)=> Promise<DataType>,
    dateRange: [DateObject, DateObject],
    setDate: (a: any) => void

}

export const useStore = create<T>()((set)=> ({
    isLogin: true,
    userLogedin: '1234567890',
    role: null,
    makeLogin: (l) => set(state => ({isLogin: true})),
    changeUserLogedin: (user_id) => set(state=> ({userLogedin: user_id})),
    changeRole: (n) => set(state => ({role: Number(n)})),
    fetcher: <DataType>(url: string| null): Promise<DataType> => {
        if (!url) {
        
        throw new Error("URL is null or undefined");
        }
        return axios.get(url).then(res => res.data);
  },

  dateRange: [
    new DateObject(),
    new DateObject().subtract(1, 'days')

  ],
  setDate : (a) => set(state=> ({dateRange: a}))
}))


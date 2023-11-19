'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Ddown from "./Dropdown"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import {useStore} from '../store/store'

interface LoginProps {
    isLogin: boolean;
    setIslogin: (value: boolean) => void;
  }


export default function Login({isLogin, setIslogin}:LoginProps){
    const [users, setUsers] = useState<string[]>([])
    const [glt, setGlt] = useState(false)
    useEffect(() => {
        fetch('/api/useridlist')
            .then(res=> res.json())
            .then(data=> setUsers(data.user_ids))
    }, [])

    const inputRef = useRef<HTMLInputElement>(null!)
    const {changeUserLogedin, changeRole, role} = useStore((state) => state)
    const handleClicck = () => {

        if (users.includes(inputRef.current.value)) {
            setIslogin(true)
            changeUserLogedin(inputRef.current.value)

        } else {
            setGlt(true)
        }
        
            

    }
    console.log(users)



    return(
        <section className="grid place-content-center min-h-screen sm:w-screen">
            
            {glt?
                <span> این آیدی در دیتابیس وجود ندارد، وارد اپ نشده </span>
            :
            <Card>
                <CardHeader>
                    <CardTitle>خوش آمدید</CardTitle>
                    <CardDescription>لطفا وارد شوید</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">

                    <div id="userid">

                        <Label className="font-bold">یوزر آیدی خود را وارد کنید</Label>
                        <Input ref={inputRef} placeholder="یوزر آيدی وارد شده در اپ"></Input>
                    </div>
                    <div id="pass">
                        <Label className="font-bold">گذرواژه خود را وارد کنید</Label>
                        <Input placeholder="در ورود اول همان یوزر آیدی"></Input>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-between gap-4">
                    
                    <Button className="font-extrabold text-xl text-justify bg-red-500"onClick={handleClicck}>ورود</Button>
                    <Button  className=" bg-gray-800 w-364">آیا مشکلی در ورودی دارید؟</Button>
                    
                </CardFooter>
            </Card>
}
        </section>
    )
}
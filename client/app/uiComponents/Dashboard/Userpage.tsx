import { useStore } from "@/app/store/store"

import  Combobox  from "./form/drugSearch"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {useState, useRef} from 'react'
import { Button } from "@/components/ui/button"
import {RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import UserForm from "./form/ProfileForm"
 

export default function Userpage (){




    const {role, userLogedin} = useStore((state)=> state)
    return (
        
            <main className=""> 
            <div className="">


                کاربر {userLogedin} خوش آمدید
                <br></br>
                شما هنوز فرم خود را تکمیل نکرده اید!
                <br></br>
                لطفا فرم این صفحه را به دقت تکمیل کنید

            </div>
            <section className=" flex items-center justify-center">

                <UserForm/>



        </section>
        </main>
    )
}

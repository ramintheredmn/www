import { useStore } from "@/app/store/store"

import UserForm from "./form/ProfileForm"
 

export default function Userpage (){




    const {role, userLogedin} = useStore((state)=> state)
    return (
        
            <main className="font-pinar-li"> 
            <div className="font-pinar-li">


                کاربر {userLogedin} خوش آمدید
                <br></br>
                شما هنوز فرم خود را تکمیل نکرده اید!
                <br></br>
                لطفا فرم این صفحه را به دقت تکمیل کنید

            </div>
            <section className="">

                <UserForm/>



        </section>
        </main>
    )
}

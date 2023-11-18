'use client'

import Image from 'next/image'
import { useState } from 'react'
import Login from './uiComponents/Login'
import {useStore} from './store/store'
import Dashboard from './uiComponents/Dashboard/Dashboard'
import Navbar from './uiComponents/Navbar'
function Main () {
  const {userLogedin} = useStore((state) => state)
  //console.log(userLogedin)
  return(
    <section className='flex flex-row'>
      <Dashboard />
      
      
    </section>
  )

}

export default function Home() {

  const {isLogin, makeLogin} = useStore((state)=>state)
  return (
    <section className=''>
    <div><Navbar/></div>

    <main dir='rtl' className='pt-20 w-screen min-h-screen'>
      

      {!isLogin?  
      
      <Login isLogin={isLogin} setIslogin={makeLogin}/>
      
      :

      <Main/>
      }

 

    </main>
    </section>
  )
}

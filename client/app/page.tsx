'use client'

import Image from 'next/image'
import { useState } from 'react'
import Login from './uiComponents/Login'
import {useStore} from './store/store'
import Dashboard from './uiComponents/Dashboard/Dashboard'
import Navbar from './uiComponents/Navbar'


export default function Home() {

  const {isLogin, makeLogin} = useStore((state)=>state)
  return (
    <section className='flex flex-col'>
    <div className='sticky top-0 left-0 w-full z-50'><Navbar/></div>

    <main dir='rtl' className='flex-shrink'>


      {!isLogin?

      <Login isLogin={isLogin} setIslogin={makeLogin}/>

      :
        <section className='p-24'><Dashboard/></section>
     
      }



    </main>
    </section>
  )
}

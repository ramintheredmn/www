'use client';
import { list } from 'postcss';
import { data } from 'autoprefixer';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import Footer from './components/footer';

import Navabr from './components/navbar';


export default function Home() {
  const [theme, setTheme] = useState('cupcake')


  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);
  console.log(setTheme)

  return(
    <>

    
    <div className='w-full h-full'>
    <Navabr title="Homepage" teme={theme} setTeme={setTheme} />
  
    <div className=' flex content-center items-center justify-center bg-base-100 text-xl'><p className=' mt-5 justify-center'>From the navbar menu select Chart demo</p></div>
    <div className='  flex  content-baseline justify-end'><Footer /></div>
    
    </div>
    
    </>
  )
}


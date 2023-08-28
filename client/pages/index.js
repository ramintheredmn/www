'use client';
import { list } from 'postcss';
import { data } from 'autoprefixer';
import { useEffect, useState, useRef } from 'react';
import React from 'react';


import Navabr from './components/navbar';


export default function Home() {
  return(
    <>
    
    <div className='bg-base-100 w-full h-full'>
    <Navabr title="Homepage" />
  
    <div className='flex content-center items-center justify-center bg-base-100 text-xl'><p className='bg-base-100 mt-5 justify-center'>From the navbar menu select Chart demo</p></div>
    </div>
    </>
  )
}


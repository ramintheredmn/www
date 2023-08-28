'use client';
import { list } from 'postcss';
import { data } from 'autoprefixer';
import { useEffect, useState, useRef } from 'react';
import React from 'react';


import Navabr from './components/navbar';


export default function Home() {
  return(
    <>
    <div className='w-full h-full'>
    <Navabr title="Homepage" />
    </div>
    </>
  )
}


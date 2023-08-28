'use client';
import { list } from 'postcss';
import { data } from 'autoprefixer';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import axios from 'axios';


import Navabr from './components/navbar';






export default function Home() {
  const [userHeartRate, setUserHeartRate] = useState([]);
  const [userTimestamp, setUserTimestamp] = useState([]);

  return(
    <>
    <div className='w-full h-full'>
    <Navabr title="Homepage" />
    </div>
    </>
  )
}


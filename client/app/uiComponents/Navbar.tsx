'use client'
import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
const Navbar = () => {


  return (
    <div className="flex justify-between items-center w-full h-20 px-4 text-white bg-gray-800 fixed nav">
      <div>
        {/* <h1 className="text-5xl font-signature ml-2"><a className="link-underline hover:transition ease-in-out delay-150 hover:underline hover:decoration-solid" href="">Logo</a></h1> */}
        <h1 className="text-5xl font-signature ml-2">
          <a
            className="link-underline link-underline-black bg-red-500 text-red-500"
            href=""
            target="_blank"
            rel="noreferrer"
          >
            <AiOutlineHeart/>
          </a>
        </h1>
      </div>



    </div>
  );
};

export default Navbar;
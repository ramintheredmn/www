'use client-'
import {AiOutlineUser} from 'react-icons/ai'
import {BsHeartPulse} from'react-icons/bs'
import {FiActivity} from 'react-icons/fi'
import {BiSupport} from 'react-icons/bi'


export default function Sidebar({tab,settab}: {settab: (n: any) => void, tab:Number},) {
    
    return(
        <>
        <div className="fixed top-20 right-0 flex flex-col w-16 m-0 h-screen
         bg-gray-900 text-secondary
         shadow-lg">
        <button className={tab===0 ? 'bg-gray-300' : ''} onClick={() => settab(0)}><SidebarIcon  icon={<AiOutlineUser size="28"/>} /></button>
        <button className={tab===1 ? 'bg-gray-300' : ''} onClick={() => settab(1)}><SidebarIcon  icon={<BsHeartPulse size="28"/>} /></button>
        <button className={tab===2 ? 'bg-gray-300' : ''} onClick={() => settab(2)}><SidebarIcon  icon={<FiActivity size="28"/>} /></button>
        <button className={tab===3 ? 'bg-gray-300' : ''} onClick={() => settab(3)}><SidebarIcon  icon={<BiSupport size="28"/>} /></button>
        </div>

        </>
    )
}


const SidebarIcon = ({icon}: any) => (

    <div className=" relative flex items-center justify-center h-12
                    w-12 rounded-3xl mt-2 mb-2 mx-auto shadow-lg bg-gray-800 text-red-500
                    hover:bg-green-800 hover:text-white hover:rounded-xl
                     transition-all duration-300 cursor-pointer">
        {icon}

    </div>
)
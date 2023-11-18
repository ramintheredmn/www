'use client'
import Sidebar from './sidebar'
import { useState, lazy, Suspense } from 'react'
const Userpage = lazy(() => import('./Userpage'));
const Chart = lazy(() => import('./onlehr'));


export default function Dashboard() {
    const [tab, setTab] = useState(0);
    const renderTabContent = () => {
      switch (tab) {
        case 0:
          return <Userpage />;
        case 1:
          return <Chart />;
        case 2:
          return <div>فعالیت و خواب</div>;
        case 3:
          return <div>تماس با ما</div>;
        default:
          return null;
      }
    };
    return (
      <main>
        <Sidebar settab={setTab} tab={tab} /> 
        <section className='fixed top-20 mb-2 right-20 bottom-10 w-11/12'> 
        
        <div className=''>

        <Suspense fallback={<div className=' relative flex items-center justify-center'>در حال بارگیری ... </div>}>
            {renderTabContent()}
          </Suspense>

        </div>
      </section>
      </main>

    );
  }
  
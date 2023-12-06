'use client'
import Sleep from './Sleep';
import Sidebar from './sidebar'
import { useState, lazy, Suspense } from 'react'
const Userpage = lazy(() => import('./Userpage'));
const Chart = lazy(() => import('./onlehr'));
//import RawheartChart from './onlehr';

export default function Dashboard() {
    const [tab, setTab] = useState(0);
    const renderTabContent = () => {
      switch (tab) {
        case 0:
    
          return <Userpage />;
        case 1:
          return <Chart />;
        case 2:
          return <div><Sleep/></div>;
        case 3:
          return <div>تماس با ما</div>;
        default:
          return null;
      }
    };
    return (
      <main>
        <Sidebar settab={setTab} tab={tab} /> 
        <section className=''> 
        
        <div className=''>

        <Suspense fallback={<div className=''>در حال بارگیری ... </div>}>
            {renderTabContent()}
          </Suspense>

        </div>
      </section>
      </main>

    );
  }
  
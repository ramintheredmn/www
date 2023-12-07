'use client'
//import { Heartchart } from './Charts';
//import Sleep from './Sleep';
import Sidebar from './sidebar'
import { useState, lazy, Suspense } from 'react'
//import Sleep from './Charts';
//import { Heartchart } from './Charts';
const Userpage = lazy(() => import('./Userpage'));
const HeartChart = lazy(() => import('./HeartRateCharts'));
const SleepChart = lazy(() => import('./SleepCharts'));



//import RawheartChart from './onlehr';

export default function Dashboard() {
    const [tab, setTab] = useState(0);
    const renderTabContent = () => {
      switch (tab) {
        case 0:
    
          return <Userpage />;
        case 1:
          return <div><HeartChart/></div>;
        case 2:
          return <div><SleepChart/></div>;
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
  
import Navabr from "./components/navbar"
import React, {PureComponent} from "react";
import { useEffect, useState, useRef } from "react";
import {BiChevronDown, BiChevronRight} from 'react-icons/bi'
import {AiOutlineSearch} from 'react-icons/ai'
import axios from 'axios';
import dynamic from 'next/dynamic'
import Footer from "./components/footer";

const DynamicApexChart = dynamic(() => import ('react-apexcharts'), { ssr: false });



function Chart(probs) {

  let state = {
    series: [{
      name: 'Heart Rate',
      data: probs.userHeartRate
    }, {
    name: 'Moving average',
    data: probs.userHeartRateMA
    }
  ],
    options: {
      chart: {
        
        height: '100%',
        parentHeightOffset: 15,
        type: 'line'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3
      },

      xaxis: {
        
        type: "datetime",
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      theme: {
        mode: 'dark', 
        fill: 'black',
        palette: 'palette4', 
        monochrome: {
            enabled: false,
            color: 'black',
            shadeTo: 'light',
            shadeIntensity: 0.65
        },
    },
      tooltip: {
        x: {
          format: "dd MMM yyyy HH:mm"
        },
      },

      

    },

  }



  return(
    <div>
      {(typeof window !== 'undefined') &&
        <DynamicApexChart options={state.options} series={state.series} type="area" height={350} />
     }

    </div>
  )
}






  function Sidebar(props) {
    const [userHeartRate, setUserHeartRate] = useState([]);
    const [userTimestamp, setUserTimestamp] = useState([]);
    const [userHeartRateMA, setUserHeartRateMA] = useState([]);

    return(
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
            <div className=" bg-base-100">
            
            <div className="bg-base-100"><Chart userHeartRateMA={userHeartRateMA} userHeartRate={userHeartRate} userTimestamp={userTimestamp} /></div>
            <label htmlFor="my-drawer" className="  w-3 btn btn-primary"><figure className="w-3 h-3"><BiChevronRight /></figure></label>
            
            </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-1 w-70 min-h-full bg-base-200 text-base-content">
                    
                  <li><a><UserIdDropDown setUserHeartRateMA={setUserHeartRateMA} setUserHeartRate={setUserHeartRate} setUserTimestamp={setUserTimestamp} /></a></li>
                  <div className="w-70 bg-base-200"></div>


                </ul>
            </div>
        </div>
    )
}




function UserIdDropDown ({ setUserHeartRateMA, setUserHeartRate, setUserTimestamp}) {
    const [userids, setUserids] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [selected, setSelected] = useState("")
    const [open, setOpen] = useState(false)
    const [windowsize, setWindow] = useState('5')
    const [windowinputValue, setWindowInputValue] = useState(windowsize);

    
  
    
    const fetchUserData = async (selected, windowsize) => {
      try {
        const res = await axios.get(`/api/time_interval?interval=day&userid=${selected}&windowsize=${windowsize}`);
        const user_data = res.data;
  
        console.log(user_data);
        console.log(windowsize)
        const formattedData = user_data.heart_rates.map((value, index) => {
          return { x: user_data.timestamps[index], y: value };
        });
        const formattedDataMa = user_data.heart_rates_MA.map((value, index) => {
          return { x: user_data.timestamps[index], y: value };
        });
        setUserHeartRate(formattedData);
        setUserTimestamp(user_data['timestamps']);
        setUserHeartRateMA(formattedDataMa)
      } catch (error) {
        console.log('Error : ', error);
      }
    };
    
  
    
  
  
    useEffect(() => {
      const fetchUserIds = async () => {
        try {
          const res = await axios.get('/api/useridlist');
          const userid_data = res.data;
          console.log(userid_data['user_ids'])
          setUserids(userid_data['user_ids'])
        } catch (error) {
          console.log('Error : ', error)
        }
      };
  
      fetchUserIds();  // Calling the async function within useEffect
    }, []);
  
    const sendData = async (selecteduserid) => {
      try {
        const response = await axios.post('/api/user_id', JSON.stringify(selecteduserid), {
          headers: {
            'Content-Type': 'application/json'
          }
          
        });
        console.log('success: ', response.data);
      } catch (er) {
        console.error("eror", er)
      }
      
    }
  
    useEffect(() => {
      if (selected) {
          sendData(selected);
          fetchUserData(selected, windowsize);
      }
  }, [selected, windowsize]);
  
    return (
      <div className='w-75 font-medium h-85'>
              <div
              onClick={()=> setOpen(!open)}
              className={`bg-white text-gray-900 w-full h-full p-2 flex items-center justify-between rounded ${!selected && "text-gray-700"}`}>
                {selected ? selected : 'select user id'}
                <BiChevronDown size={20}/>
              </div>
              <ul className={`bg-white mt-2 overflow-y-auto ${open ? "max-h-60" : "max-h-0"}`} >
                <div className='flex items-center px-2 sticky top-0 bg-white'>
                  <AiOutlineSearch size={18} className='text-gray-700'/>
                  <input type='text'
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                  }
                  }
                  placeholder='Enter user ID'
                  className='placeholder:text-white p-2 outline-none' />
                </div>
                
                {
                  userids?.map((userid) => (
                    <li key={userid}
                    onClick={() => {
                      setSelected(userid !== selected && userid)
                      setOpen(false)
                    }}
                    className={`text-black p-2 text-sm hover:bg-sky-600 hover:text-white
                    ${userid?.startsWith(inputValue) ? "block" : "hidden"}`}>
                      {userid}</li>
        
                  ))
                }
                
              </ul>
             


              <div className="w-70 join">
                <input
                  value={windowinputValue}
                  onChange={(e) => setWindowInputValue(e.target.value)}
                  className="flex w-70 input input-bordered join-item"
                  placeholder="Enter window size"
                />
                <button
                  onClick={() => setWindow(windowinputValue)}
                  className="btn join-item rounded-r-full"
                >
                  Submit
                </button>
              </div>
            </div>
      
    )
  }



function Chartpage(){

  const [theme, setTheme] = useState('light')


  useEffect(() => {
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
    <div className="">
    <Navabr title="Chart" setTeme={setTheme} />
    <div className="w-full h-full"><Sidebar /></div>
    <Footer />
    </div>


    </>
  )
}

export default Chartpage
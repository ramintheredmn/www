import Navabr from "../components/navbar"

import React, { useEffect, useState, useRef } from "react";
import {BiChevronDown, BiChevronRight} from 'react-icons/bi'
import {AiOutlineSearch} from 'react-icons/ai'
import axios from 'axios';
import dynamic from 'next/dynamic'


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
        toolbar: {
          show: probs.toolbarsat,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          },
          export: {
            csv: {
              filename: undefined,
              columnDelimiter: ',',
              headerCategory: 'category',
              headerValue: 'value',
              dateFormatter(timestamp) {
                return new Date(timestamp).toDateString()
              }
            },
            svg: {
              filename: undefined,
            },
            png: {
              filename: undefined,
            }
          },
          autoSelected: 'zoom' 
        },
        
        
        
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
        palette: 'palette5', 
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
    <div className=" h-[80vh]">
      {(typeof window !== 'undefined') &&
        <DynamicApexChart options={state.options} series={state.series} height={'100%'} />
     }
</div>
    
  )
}






  function Sidebar(props) {
    const [userHeartRate, setUserHeartRate] = useState([]);
    const [userTimestamp, setUserTimestamp] = useState([]);
    const [userHeartRateMA, setUserHeartRateMA] = useState([]);
    const [side, setSide] = useState({
      open: "checked",
      
    })
    const [toolbar, setToolbar] = useState(true)

    let checked = side.open

    return(
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={checked} />
            <div className="drawer-content">
            <div className="bg-base-100">

              <div className="object-contain basis-auto bg-base-100"><Chart userHeartRateMA={userHeartRateMA} userHeartRate={userHeartRate} userTimestamp={userTimestamp} toolbarsat={toolbar} /></div>
              <label htmlFor="my-drawer" className=" basis-3 place-items-start w-3 btn btn-secondary"><figure onClick={() => {
                 setSide({open: "open"})
                 setToolbar(false)
                 }} className="flex items-center"><BiChevronRight size={40} /></figure></label>
              
            </div>
            </div>
            <div className="drawer-side">
                <label onClick={() => {
                  setSide({open: ""})
                  setToolbar(true)
                  }} htmlFor="my-drawer" className=" drawer-overlay"></label>
                <ul className="menu p-1 w-70 min-h-full bg-base-200 text-base-content">
                    
                  <li><a><UserIdDropDown setUserHeartRateMA={setUserHeartRateMA} setUserHeartRate={setUserHeartRate} setUserTimestamp={setUserTimestamp} setside={setSide} setToolbar={setToolbar} /></a></li>
                  <div className="w-70 bg-base-200"></div>


                </ul>
            </div>
        </div>
    )
}




function UserIdDropDown ({ setUserHeartRateMA, setUserHeartRate, setUserTimestamp, setside, setToolbar}) {
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
      <div className='w-[20hv] font-medium'>
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
                      setside({
                       open: ""
                      })
                      setToolbar(true)
                    }}
                    className={`text-black p-2 text-sm hover:bg-sky-600 hover:text-white
                    ${userid?.startsWith(inputValue) ? "block" : "hidden"}`}>
                      {userid}</li>
        
                  ))
                }
                
              </ul>
             


              <div className="mt-3 w-70 join">
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

              <div className="mt-3 p-2"><DateRangePicker setSide={setside} /></div>
            </div>
      
    )
  }

  const DateRangePicker = ({setSide}) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
  
    const handleStartDateChange = (e) => {
      setStartDate(e.target.value);
      if (new Date(endDate) < new Date(e.target.value)) {
        setEndDate("");
      }
    };
  
    return (
      <div>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </label>
  
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <div className="mt-3">
        <button className="btn btn-warning"
        onClick={()=> setSide({
          open: ""
        })}>Close</button></div>
      </div>
    );
  };



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

    </div>


    </>
  )
}

export default Chartpage
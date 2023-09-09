import Navabr from "../components/navbar"

import React, { useEffect, useState, useRef } from "react";
import {BiChevronDown, BiChevronRight} from 'react-icons/bi'
import {AiOutlineSearch} from 'react-icons/ai'
import axios from 'axios';
import dynamic from 'next/dynamic'



const DynamicApexChart = dynamic(() => import ('react-apexcharts'), { ssr: false }); //dynamic import to prevent ssr


// chart component
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
// sidebar
  function Sidebar(props) {
    const [userHeartRate, setUserHeartRate] = useState([]);
    const [userTimestamp, setUserTimestamp] = useState([]);
    const [userHeartRateMA, setUserHeartRateMA] = useState([]);
    const [side, setSide] = useState({
      open: "",
      
    })
    const [toolbar, setToolbar] = useState(true)

    

    return(
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={side.open} />
            <div className="drawer-content">
            <div className="bg-base-100">

              <div className="object-contain basis-auto bg-base-100"><Chart userHeartRateMA={userHeartRateMA} userHeartRate={userHeartRate} userTimestamp={userTimestamp} toolbarsat={toolbar} /></div>
              <label htmlFor="my-drawer" className=" basis-3 place-items-start w-3 btn btn-secondary"><figure onClick={() => {
                 setSide({open: "checked"})
                 setToolbar(false)
                 }} className="flex items-center"><BiChevronRight size={40} /></figure></label>
              
            </div>
            </div>
            <div className="drawer-side">
                <label onClick={() => {
                  setSide({open: ""})
                  setToolbar(true)
                  }} htmlFor="my-drawer" className=" drawer-overlay"></label>
                <ul className="menu p-1 w-50 min-h-full bg-base-200 text-base-content">
                    
                  <li><a><UserIdDropDown setUserHeartRateMA={setUserHeartRateMA} setUserHeartRate={setUserHeartRate} setUserTimestamp={setUserTimestamp} setside={setSide} setToolbar={setToolbar} /></a></li>
                  
                  <div className="w-70 bg-base-200"></div>


                </ul>
            </div>
        </div>
    )
}
// the main component for fetching and showing data 
function UserIdDropDown ({ setUserHeartRateMA, setUserHeartRate, setUserTimestamp, setside, setToolbar}) {
  // definig variables
    const [userids, setUserids] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [selected, setSelected] = useState("")
    const [open, setOpen] = useState(false)
    const [windowsize, setWindow] = useState('5')
    const [windowinputValue, setWindowInputValue] = useState(windowsize);
    const [value, setValue] = useState({
      startDate: null,
      endDate: null
  });
  const [startDate, setStartdate] = useState(value.minTimestamp)
  const [endDate, setEnddate] = useState(value.endDate)
  const [calenderon, setCalnderon] = useState(false)
 
  // end definig varibales

  // defining functions

  //   function for fetching user data

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
 // function for posting the selected user id to api
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
    }}

    // function for getting the first and the latest timestamp for the selected user id
    const fetchLatestTimestamp = async (user_id) => {
      try {
          const res = await axios.get(`/api/latest_timestamp?userid=${user_id}`);
          const maxTimestamp = res.data['maxTimestamp'];
          const minTimestamp = res.data['minTimestamp']

          setValue({
              startDate: minTimestamp,
              endDate: maxTimestamp
              
          });

          console.log(value)

      } catch (error) {
          console.log('Error fetching latest timestamp:', error);
      }
  };
// function for getting the heart rates and MA and TS of the selected user id
    const fetchUserData = async (selected, windowsize) => {
      try {


        const res = await axios.get(`/api/time_interval?interval=day&userid=${selected}&windowsize=${windowsize}`);
        const user_data = res.data;
  
        console.log(user_data);
        console.log(windowsize)
        const formattedData = user_data.heart_rates.map((value, index) => {
          return { x: user_data.timestamps[index], y: Math.floor(value) };
        });
        const formattedDataMa = user_data.heart_rates_MA.map((value, index) => {
          return { x: user_data.timestamps[index], y: Math.floor(value) };
        });
        setUserHeartRate(formattedData);
        setUserTimestamp(user_data['timestamps']);
        setUserHeartRateMA(formattedDataMa)
      } catch (error) {
        console.log('Error : ', error);
      }
    };

    const fetchUserDataCal = async (selected, windowsize, startDate, endDate) => {
      try {


        const res = await axios.get(`/api/calenderTimeinterval?userid=${selected}&windowsize=${windowsize}&startdate=${startDate}&enddate=${endDate}`);
        const user_data = res.data;
  
        console.log(user_data);
        console.log(windowsize)
        const formattedData = user_data.heart_rates.map((value, index) => {
          return { x: user_data.timestamps[index], y: Math.floor(value) };
        });
        const formattedDataMa = user_data.heart_rates_MA.map((value, index) => {
          return { x: user_data.timestamps[index], y: Math.floor(value) };
        });
        setUserHeartRate(formattedData);
        setUserTimestamp(user_data['timestamps']);
        setUserHeartRateMA(formattedDataMa)
      } catch (error) {
        console.log('Error : ', error);
      }
    };
// end defingig functions

// start callig functions

// I use useEffect hook to only rerender the component when is needed, the state of the varible(s) inside the 
// list of the hook cause the functions inside the hook to run, 

    useEffect(()=> {
      fetchUserIds()
    }, [])

    useEffect(() => {
      fetchLatestTimestamp(selected);
    }, [selected])
  
    useEffect(() => {
      if (selected) {
          sendData(selected);
          calenderon?fetchUserDataCal(selected, windowsize, startDate, endDate):fetchUserData(selected, windowsize);

      }
  }, [selected, windowsize, startDate, endDate]);
// end calling functions



  
    return (
      <div className='w-[20hv] font-medium'>
              <div
              onClick={()=> setOpen(!open)}
              className={`bg-white text-gray-900 w-full h-full p-1 flex items-center justify-between rounded ${!selected && "text-gray-700"}`}>
                {selected ? selected : 'select user id'}
                <BiChevronDown size={20}/>
              </div>
              <ul className={`bg-white mt-2 pr-2 overflow-y-auto ${open ? "max-h-60" : "max-h-0"}`} >
                <div className='flex items-center sticky top-0 bg-white'>
                  <AiOutlineSearch size={18} className='text-gray-700'/>
                  <input type='text'
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                  }
                  }
                  placeholder='Enter user ID'
                  className='w-full placeholder:text-gray-800 text-gray-800 bg-white p-2 mr-2 outline-none' />
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
              <br></br> 
              <div className=" flex flex-row mt-4"><p className="">I want to use the calender</p><input type="checkbox" className=" ml-2 toggle" onChange={() => setCalnderon(!calenderon)} /></div>

                  <div className={`${calenderon ? "collapse" : "collapse collapse-close"}  mt-4 collapse bg-base-100 h-full `}>
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      Click to show calender
                    </div>
                    <div className="h-full w-full collapse-content">
                      <p>first select a user-id <br></br> by default the chart shows the last day<br></br>select between the days below : </p>
                      <div className="">{selected?<p>The seleceted user Id has data from <br></br> {value.startDate} to {value.endDate} </p>: <p>select a user ID first</p>}</div>
                      <Calendermodal startdate={startDate} setstartdate={setStartdate} enddate={endDate} setenddate={setEnddate} />
                    </div>
                  </div>
            </div>
      
    )
  }

  function Calendermodal({startdate, setstartdate, enddate, setenddate}) {
    const [inputdate, setInputdate] = useState({
      startdate: null,
      enddate: null
    })
    return (
      <>

        <button className="btn" onClick={() => document.getElementById('my_modal_4').showModal()}>open calender</button>
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box w-11/12 max-w-5xl h-full">
            <h3 className="font-bold text-lg">Hello!</h3>
            <div className="mt-5 bg-base-300 card font-semibold">
              <div className="card-body flex flex-col items-center justify-center">
              <div
              onChange={(e) => setInputdate(ps => ({...ps, startdate: e.target.value}))}
              value={inputdate.startDate}
              className="mt-5"><h3>Enter the start date and time : </h3><input type="datetime-local"></input></div>
              <div 
              onChange={(e) => setInputdate(ps => ({...ps, enddate: e.target.value}))}
              value={inputdate.enddate}
              className="mt-5"><h3>Enter the end date and time : </h3><input type="datetime-local"></input></div>
              <button
              onClick={() => {
                 console.log("start daate is", startdate, " enddate is :", enddate )
                 setstartdate(inputdate.startdate)
                 setenddate(inputdate.enddate)
                }} 
              className="mt-3 btn btn-primary">submit</button>
            </div>

            </div>
            <p className="py-4">Click the button below to close</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </>
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

    </div>


    </>
  )
}

export default Chartpage
import Navabr from "./components/navbar"
import React from "react";
import { useEffect, useState, useRef } from "react";
import {BiChevronDown} from 'react-icons/bi'
import {AiOutlineSearch} from 'react-icons/ai'
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';











function Chart(probs) {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const labels = probs.userTimestamp;

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: probs.userHeartRate,
      borderColor: 'white',
      
    }
 
  ],
};


  return(
    <div>
    <Line options={options} data={data} />
    </div>
  )
}



  function Sidebar(props) {
    const [userHeartRate, setUserHeartRate] = useState([]);
    const [userTimestamp, setUserTimestamp] = useState([])
    return(
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
            <div className=" bg-base-100 content-center justify-center self-center">
            <label htmlFor="my-drawer" className=" self-center content-center btn btn-primary drawer-button">Open drawer</label>
            <div><Chart userHeartRate={userHeartRate} userTimestamp={userTimestamp} /></div>
            </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    
                  <li><a><UserIdDropDown setUserHeartRate={setUserHeartRate} setUserTimestamp={setUserTimestamp} /></a></li>


                </ul>
            </div>
        </div>
    )
}




function UserIdDropDown ({ setUserHeartRate, setUserTimestamp }) {
    const [userids, setUserids] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [selected, setSelected] = useState("")
    const [open, setOpen] = useState(false)
    
  
    
    const fetchUserData = async (selected) => {
      try {
        const res = await axios.get(`/api/time_interval?interval=day&userid=${selected}`);
        const user_data = res.data;
  
        console.log(user_data);
        // const formattedData = user_data.heart_rates.map((value, index) => {
        //   return { time: user_data.timestamps[index], value: value };
        // });
        setUserHeartRate(user_data['heart_rates']);
        setUserTimestamp(user_data['timestamps']);
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
          fetchUserData(selected);
      }
  }, [selected]);
  
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
            </div>
      
    )
  }



function Chartpage(){

  return (
    <>
    
    <Navabr title="Chart" />
    <Sidebar />


    </>
  )
}

export default Chartpage
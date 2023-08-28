'use client';
import { list } from 'postcss';
import { data } from 'autoprefixer';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { AiOutlineSearch } from 'react-icons/ai'
import axios from 'axios';
import { SizeMe } from 'react-sizeme';
import dynamic from 'next/dynamic';
import Navabr from './components/navbar';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })


class Chart extends React.Component {
  render() {
    const { userHeartRate, userTimestamp, size } = this.props;

    return (
      <div>
        <Plot
          data={[
            {
              x: userTimestamp,
              y: userHeartRate,
              type: 'scatter',
              marker: { color: 'red' },
            },
          ]}
          layout={{
            width: size.width,
            height: 600,
            autosize: true,  // Automatically adjust to fit container
            title: 'HeartRate over time',
          }}
          config={{ responsive: true }}
        />
      </div>
    );
  }
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

function Window_size() {
  return(

      <div className="join">
  <input className="input input-bordered join-item" placeholder="Window size"/>
  <button className="btn join-item rounded-r-full">Submit window size</button>
</div>

  )
}




export default function Home() {
  const [userHeartRate, setUserHeartRate] = useState([]);
  const [userTimestamp, setUserTimestamp] = useState([]);

  return(
    <>
    

    
        
      <Navabr />
      <div className='flex-col w-full h-full items-center'>

        <SizeMe>
          {({size}) => <div>
            <Chart userHeartRate={userHeartRate} userTimestamp={userTimestamp} size={size} />
          </div>}
        </SizeMe>
          <div class="flex items-center align-middle justify-center">
            <div class="flex-none w-90 h-14 mt-3">
            <UserIdDropDown setUserHeartRate={setUserHeartRate} setUserTimestamp={setUserTimestamp} />

            </div>
            <div class=" p-2 flex-initial w-72 ...">
            <Window_size />
          </div>
            </div>
            </div>



    </>
  )
}


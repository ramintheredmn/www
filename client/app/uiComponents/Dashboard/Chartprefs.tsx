'use client'
import * as react from 'react'
import DatePicker from 'react-multi-date-picker'
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { DateObject } from 'react-multi-date-picker'
import { useStore } from '@/app/store/store'
import { TbZoomReset } from 'react-icons/tb'

export function Datepicker () {

  const {dateRange, setDate} = useStore((state) => state)
  const handleDateChange = (date: DateObject | DateObject[] | null) => {
  // Assuming you want to set the state only when `date` is not null and is an array
  if (Array.isArray(date)) {
    setDate(date);
  }
};
    return (
        <>
             <div className="flex flex-row" style={ {direction:"rtl"}}>

              <p>بازه زمانی : </p>
              <DatePicker
                calendar={persian}
                range
                rangeHover
                value={dateRange}
                onChange={handleDateChange}
                locale={persian_fa}
                calendarPosition="bottom-right"

                />
            </div>
        </>

    )
}   

export function Chartpref ({resetZoom} : {resetZoom: any}) { 
  return (
      <div className='flex flex-row items-center justify-center mt-0'>
          <button className=" content-center" onClick={resetZoom}>
              <TbZoomReset />
          </button>
      </div>
  )
}

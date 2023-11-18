"use clinet"

import Datepicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function DatepickerAsl({ value, setValue }: { value:any, setValue:any}) {
  const handleDateChange = (val: any) => {
    // Convert the selected value to a Date object
    const date = new DateObject(val).toDate();
    setValue(date);
  };

  return (
    <main>
      <Datepicker
        calendar={persian}
        locale={persian_fa}
        value={value}
        onChange={handleDateChange}
      />
    </main>
  );
}

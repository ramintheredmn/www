import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "./Datepicker"
  type Datesend = {
    date?: any,
    setDate?: any

  }
  export function AlertDialogDemo({date, setDate}:Datesend) {

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" >تقویم</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تاریخ شروع وپایان را انتخاب کنید </AlertDialogTitle>
            <AlertDialogDescription>
              دقت داشته باشید که انتخاب دوره زمانی طولانی تر زمان پردازش طولانی تر خواهد بود
              <DatePickerWithRange date={date} setDate={setDate}/>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction
            onClick={() => {}}
            >ادامه</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  
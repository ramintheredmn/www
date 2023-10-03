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
    date: any,
    setDate: any
    calendershow:  boolean
  }
  export function AlertDialogDemo({date, setDate, calendershow}:Datesend) {

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" >Calender</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Choose the startdate and enddate </AlertDialogTitle>
            <AlertDialogDescription>
              Attention choosing longer time intervals may take some time to load !
              <DatePickerWithRange date={date} setDate={setDate}/>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            onClick={() => {}}
            >Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  
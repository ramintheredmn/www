"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps, DropdownMenuGroup, DropdownMenuPortal } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "../dialog"
type Checked = DropdownMenuCheckboxItemProps["checked"]

export function Chartconfig({hrshow, setHrshow, maon, setMaon, windowsize, setWindowsize, userid}:{
    hrshow: boolean,
    setHrshow: any,
    maon: boolean,
    setMaon: any,
    windowsize: number,
    setWindowsize: any,
    userid: any
}) {

    const[dropstatus, setDropstatus] = React.useState(false)
  return (

    <>
    <Dialog>
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" 
       
        >Configure chart</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-full">
      <DropdownMenuLabel>Basic config</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={hrshow}
        onCheckedChange={setHrshow}

      >
        raw HeartRate
      </DropdownMenuCheckboxItem>
      <DropdownMenuGroup className="flex flex-row justify-center">
      <DropdownMenuCheckboxItem
        checked={maon}
        onCheckedChange={setMaon}

        
      >
        Moving average
      </DropdownMenuCheckboxItem>
      <Input size={7} placeholder="Enter windowSize" value={windowsize} onChange={(e) => setWindowsize(e.target.value)} />

      </DropdownMenuGroup>
    <DropdownMenuSeparator className="bg-gray-500"/>
    <DialogTrigger asChild>
        <DropdownMenuItem className="font-semibold rounded-md justify-center bg-slate-400 text-white">
            user info
        </DropdownMenuItem>

    </DialogTrigger>

      
    </DropdownMenuContent>
  </DropdownMenu>
    <DialogContent>
        {
            !userid?
                <div> first select user id</div>
            :
            <div className="space-y-2">
                
                <h1 className="Text-xl font-bold">Info for the user id : {userid}</h1>
                
                <p>{(userid=='1461032677')?
                `Hello Dr.shahab bohlooli!`
                :
                `this is not Dr shahab bohlooli`
                }
                </p>
                
                </div>
        }
    </DialogContent>
    </Dialog>
    
    </>
  )
}

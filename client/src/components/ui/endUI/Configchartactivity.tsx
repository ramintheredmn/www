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

export function ActivityChartconfig({}:{

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


      >
        raw HeartRate
      </DropdownMenuCheckboxItem>
      <DropdownMenuGroup className="flex flex-row justify-center">
      <DropdownMenuCheckboxItem

        
      >
        Moving average
      </DropdownMenuCheckboxItem>

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

    </DialogContent>
    </Dialog>
    
    </>
  )
}

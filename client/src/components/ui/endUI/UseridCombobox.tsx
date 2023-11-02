"use client"
 
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
 
export function ComboboxDemo({userid, setUserid}:any) {
    const [ids, setIds] = React.useState([])
    React.useEffect(()=>{
        fetch("/api/useridlist")
            .then((r)=>r.json())
            .then((data)=> setIds(data['user_ids']))
        
    }, [])
  const [open, setOpen] = React.useState(false)
  
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {userid
            ? ids.find((id) => id === userid)
            : "یوزر آیدی انتخاب کنید"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="جست و جوی آید " />
          <CommandEmpty>هیج آیدی یافت نشد</CommandEmpty>
          <CommandGroup>
            {ids.map((id, index) => (
              <CommandItem
                key={index}
                onSelect={(currentValue) => {
                  setUserid(currentValue === userid ? "" : currentValue)
                  setOpen(false)
                }}

              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    userid === id ? "opacity-100" : "opacity-0"
                  )}
                />
                {id}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
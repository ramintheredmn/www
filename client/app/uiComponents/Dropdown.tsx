'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

type Props = {
    title: string,
    lable: string,
    items: string[],
    setter: any,
}
export default function Ddown (props: Props){

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="bg-red-500 rounded-xl w-12 p-1 text-center shadow-lg hover:scale-150">{props.title}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{props.lable}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {props.items?.map((key, index)=> (
                    <DropdownMenuItem onClick={()=>props.setter(index)}key={index}>{key}</DropdownMenuItem>
                ))}

            </DropdownMenuContent>
        </DropdownMenu>

    )
}
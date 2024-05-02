import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../../../../../lib/utils.js"
import { Button } from "../../../../../../components/ui/button"
import { Calendar } from "../../../../../../components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../../../../components/ui/popover"
import {useState} from "react";

export function DatePickerDemo({date, setDate}) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full  justify-start text-left font-normal py-5.5 dark:bg-[#242B51]",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 " />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0  dark:bg-[#242B51]">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date || new Date()}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

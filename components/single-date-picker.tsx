import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SingleDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  align?: "start" | "center" | "end"
  disabledDate?: (date: Date) => boolean
}

export function SingleDatePicker({
  date,
  onDateChange,
  align = "start",
  disabledDate,
  className,
}: SingleDatePickerProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "LLL dd, y")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={onDateChange}
            disabled={disabledDate || ((date) => date < new Date())}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 
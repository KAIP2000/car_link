"use client"

import * as React from "react"
import { format,isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  align?: "start" | "center" | "end"
  className?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  align = "start",
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  // Use a temporary date state for changes within the popover
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)

  React.useEffect(() => {
    // When the popover opens, sync tempDate with the prop
    if (isOpen) {
      setTempDate(date)
    }
  }, [isOpen, date])

  const handleSave = () => {
    if (tempDate?.from && tempDate?.to && isValid(tempDate.from) && isValid(tempDate.to)) {
      onDateChange(tempDate)
      setIsOpen(false)
    } else if (!tempDate?.from && !tempDate?.to) { // Allow clearing dates
        onDateChange(undefined)
        setIsOpen(false)
    }
    // If only one date is selected, or dates are invalid, do not close, let user correct
  }

  const handleClear = () => {
    setTempDate(undefined)
    // Optionally, you can call onDateChange(undefined) here if you want to clear immediately
    // without pressing save. For now, clearing only affects tempDate.
  }
  
  const handleCancel = () => {
    setTempDate(date); // Revert to original date
    setIsOpen(false);
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                <>{format(date.from, "LLL dd, y")} - Select end date</>
              )
            ) : (
              <span>Pick dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={tempDate?.from}
            selected={tempDate}
            onSelect={setTempDate}
            numberOfMonths={2}
            disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-semibold",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full",
              day_selected: "bg-blue-500 text-white opacity-100",
              day_today: "bg-neutral-200 text-accent-foreground rounded-full",
              day_outside: "text-muted-foreground opacity-30",
              day_disabled: "text-muted-foreground opacity-30",
              day_range_start: "!bg-blue-600 text-white rounded-full",
              day_range_end: "!bg-blue-600 text-white rounded-full",
              day_range_middle: "bg-blue-500/30 text-blue-700 rounded-none opacity-100",
              day_hidden: "invisible",
            }}
          />
          <div className="flex justify-end space-x-2 p-4 border-t">
            <Button variant="ghost" onClick={handleClear}>Clear</Button>
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">Save</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 
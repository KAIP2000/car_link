"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SingleDatePicker } from "@/components/single-date-picker"

export function SearchForm() {
  const [fromDate, setFromDate] = React.useState<Date>()
  const [untilDate, setUntilDate] = React.useState<Date>()

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        {/* From Section */}
        <div className="space-y-2">
          <Label>From</Label>
          <SingleDatePicker
            date={fromDate}
            onDateChange={setFromDate}
            align="start"
          />
        </div>

        {/* Until Section */}
        <div className="space-y-2">
          <Label>Until</Label>
          <SingleDatePicker
            date={untilDate}
            onDateChange={setUntilDate}
            align="start"
            disabledDate={(date) => fromDate ? date < fromDate : false}
          />
        </div>

        {/* Search Button */}
        <Button 
          size="lg"
          className="w-full md:w-auto bg-[#6C5DD3] hover:bg-[#5648B9] rounded-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

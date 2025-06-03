"use client"

import * as React from "react"
import { format, getDaysInMonth } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateSelectorProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function DateSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateSelectorProps) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  const currentDay = today.getDate()

  // State for start date components
  const [startYear, setStartYear] = React.useState<number>(currentYear)
  const [startMonth, setStartMonth] = React.useState<number>(currentMonth)
  const [startDay, setStartDay] = React.useState<number | undefined>(undefined)

  // State for end date components
  const [endYear, setEndYear] = React.useState<number>(currentYear)
  const [endMonth, setEndMonth] = React.useState<number>(currentMonth)
  const [endDay, setEndDay] = React.useState<number | undefined>(undefined)

  // Initialize with provided dates
  React.useEffect(() => {
    if (startDate) {
      setStartYear(startDate.getFullYear())
      setStartMonth(startDate.getMonth())
      setStartDay(startDate.getDate())
    }
    if (endDate) {
      setEndYear(endDate.getFullYear())
      setEndMonth(endDate.getMonth())
      setEndDay(endDate.getDate())
    }
  }, []) // Run only on mount

  // Reset internal state when parent state changes
  React.useEffect(() => {
    if (!startDate) {
      setStartYear(currentYear)
      setStartMonth(currentMonth)
      setStartDay(undefined)
    }
    if (!endDate) {
      setEndYear(currentYear)
      setEndMonth(currentMonth)
      setEndDay(undefined)
    }
  }, [startDate, endDate, currentYear, currentMonth])

  // Generate years (current year and next year)
  const years = [currentYear, currentYear + 1]

  // Get days in month for start date
  const startDaysInMonth = React.useMemo(() => {
    return getDaysInMonth(new Date(startYear, startMonth))
  }, [startYear, startMonth])

  // Get days in month for end date
  const endDaysInMonth = React.useMemo(() => {
    return getDaysInMonth(new Date(endYear, endMonth))
  }, [endYear, endMonth])

  // Handle start date changes
  const handleStartDateChange = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day)
    if (newDate >= today) {
      onStartDateChange(newDate)
      // Reset end date if it's before new start date
      if (endDate && endDate < newDate) {
        onEndDateChange(undefined)
        setEndYear(year)
        setEndMonth(month)
        setEndDay(undefined)
      }
    }
  }

  // Handle end date changes
  const handleEndDateChange = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day)
    const startDateSelected = startYear !== undefined && startMonth !== undefined && startDay !== undefined
    const startDateObj = startDateSelected ? new Date(startYear, startMonth, startDay) : undefined

    if (!startDateSelected || (startDateObj && newDate >= startDateObj)) {
      onEndDateChange(newDate)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Start Date Section */}
      <div className="flex-1 space-y-2">
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <div className="grid grid-cols-3 gap-2">
          {/* Year */}
          <Select
            value={startDay ? startYear.toString() : undefined}
            onValueChange={(value) => {
              const year = parseInt(value)
              setStartYear(year)
              if (startDay) handleStartDateChange(year, startMonth, startDay)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month */}
          <Select
            value={startDay ? startMonth.toString() : undefined}
            onValueChange={(value) => {
              const month = parseInt(value)
              setStartMonth(month)
              setStartDay(undefined) // Reset day when month changes
              if (startDay) handleStartDateChange(startYear, month, startDay)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem 
                  key={index} 
                  value={index.toString()}
                  disabled={
                    startYear === currentYear && 
                    index < currentMonth
                  }
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Day */}
          <Select
            value={startDay?.toString()}
            onValueChange={(value) => {
              const day = parseInt(value)
              setStartDay(day)
              handleStartDateChange(startYear, startMonth, day)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: startDaysInMonth }, (_, i) => i + 1).map((day) => (
                <SelectItem 
                  key={day} 
                  value={day.toString()}
                  disabled={
                    startYear === currentYear && 
                    startMonth === currentMonth && 
                    day < currentDay
                  }
                >
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End Date Section */}
      <div className="flex-1 space-y-2">
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        {!startDay ? (
          <div className="text-sm text-muted-foreground">Select a start date first</div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {/* Year */}
            <Select
              value={endDay ? endYear.toString() : undefined}
              onValueChange={(value) => {
                const year = parseInt(value)
                setEndYear(year)
                if (endDay) handleEndDateChange(year, endMonth, endDay)
              }}
              disabled={!startDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem 
                    key={year} 
                    value={year.toString()}
                    disabled={year < startYear}
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Month */}
            <Select
              value={endDay ? endMonth.toString() : undefined}
              onValueChange={(value) => {
                const month = parseInt(value)
                setEndMonth(month)
                setEndDay(undefined) // Reset day when month changes
                if (endDay) handleEndDateChange(endYear, month, endDay)
              }}
              disabled={!startDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    disabled={
                      (endYear === startYear && index < startMonth) ||
                      (endYear === currentYear && index < currentMonth)
                    }
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Day */}
            <Select
              value={endDay?.toString()}
              onValueChange={(value) => {
                const day = parseInt(value)
                setEndDay(day)
                handleEndDateChange(endYear, endMonth, day)
              }}
              disabled={!startDay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: endDaysInMonth }, (_, i) => i + 1).map((day) => (
                  <SelectItem 
                    key={day} 
                    value={day.toString()}
                    disabled={
                      (endYear === startYear && 
                       endMonth === startMonth && 
                       day <= startDay) ||
                      (endYear === currentYear && 
                       endMonth === currentMonth && 
                       day < currentDay)
                    }
                  >
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
} 
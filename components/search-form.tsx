"use client"

import { useState } from "react"
import { DateSelector } from "@/components/date-selector"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface SearchFormProps {
  onSearch: (dates: { startDate: Date | undefined; endDate: Date | undefined }) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  isSearching?: boolean;
  redirectToBrowse?: boolean;
}

export function SearchForm({ 
  onSearch, 
  initialStartDate, 
  initialEndDate, 
  isSearching = false,
  redirectToBrowse = false 
}: SearchFormProps) {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate)
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate)

  const handleSearch = () => {
    // If no dates selected, just browse all cars
    if (!startDate && !endDate) {
      if (redirectToBrowse) {
        router.push('/browse-cars')
      } else {
        onSearch({ startDate: undefined, endDate: undefined })
      }
      return
    }

    // If only start date is selected, don't proceed (button will be disabled)
    if (startDate && !endDate) {
      return
    }

    // Both dates are selected, proceed with search
    if (startDate && endDate) {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      
      if (redirectToBrowse) {
        router.push(`/browse-cars?${params.toString()}`)
      } else {
        onSearch({ startDate, endDate })
      }
    }
  }

  const handleReset = () => {
    setStartDate(undefined)
    setEndDate(undefined)
  }

  // Helper function to determine button text
  const getButtonText = (): string => {
    if (isSearching) return "Searching..."
    if (!startDate && !endDate) return "Browse Cars"
    if (startDate && !endDate) return "Select End Date"
    return "Search Cars"
  }

  // Helper function to determine if the search button should be disabled
  const isSearchButtonDisabled = (): boolean => {
    if (isSearching) return true
    // Only disable if start date is selected but end date isn't
    return Boolean(startDate && !endDate)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <div className="mt-4 flex justify-end gap-2">
        {(startDate || endDate) && (
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
        <Button 
          variant="gold" 
          onClick={handleSearch}
          disabled={isSearchButtonDisabled()}
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getButtonText()}
            </>
          ) : (
            getButtonText()
          )}
        </Button>
      </div>
    </div>
  )
}

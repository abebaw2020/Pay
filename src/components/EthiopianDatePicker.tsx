"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { ETHIOPIAN_MONTHS, getCurrentEthiopianDate, getCurrentGregorianDate } from "../utils/ethiopianCalendar"

interface EthiopianDatePickerProps {
  value: string
  onChange: (date: string) => void
  label: string
  placeholder?: string
}

export const EthiopianDatePicker: React.FC<EthiopianDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "Select date",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentYear, setCurrentYear] = useState(2016)
  const [currentMonth, setCurrentMonth] = useState(9) // Default to Sene (index 9)
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number } | null>(null)

  // Get current dates
  const currentEthiopianDate = getCurrentEthiopianDate()
  const currentGregorianDate = getCurrentGregorianDate()

  // Parse current value
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split("-").map(Number)
      setCurrentYear(year)
      setCurrentMonth(month - 1) // Convert to 0-based index
      setSelectedDate({ year, month: month - 1, day })
    }
  }, [value])

  const handleDateSelect = (day: number) => {
    const newDate = {
      year: currentYear,
      month: currentMonth,
      day,
    }
    setSelectedDate(newDate)

    // Format as YYYY-MM-DD
    const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    onChange(formattedDate)
    setIsOpen(false)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(12) // Go to Pagume
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(0) // Go to Meskerem
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const renderCalendarDays = () => {
    const month = ETHIOPIAN_MONTHS[currentMonth]
    const days = []

    for (let day = 1; day <= month.days; day++) {
      const isSelected =
        selectedDate &&
        selectedDate.year === currentYear &&
        selectedDate.month === currentMonth &&
        selectedDate.day === day

      const isToday =
        currentEthiopianDate.year === currentYear &&
        currentEthiopianDate.month - 1 === currentMonth &&
        currentEthiopianDate.day === day

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`
            w-8 h-8 text-sm rounded-md transition-colors relative
            ${
              isSelected
                ? "bg-blue-600 text-white font-semibold"
                : isToday
                  ? "bg-green-100 text-green-800 font-semibold border-2 border-green-400"
                  : "hover:bg-gray-100 text-gray-700"
            }
          `}
        >
          {day}
          {isToday && !isSelected && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>}
        </button>,
      )
    }

    return days
  }

  const formatDisplayDate = () => {
    if (!selectedDate) return placeholder

    const month = ETHIOPIAN_MONTHS[selectedDate.month]
    return `${selectedDate.day.toString().padStart(2, "0")}/${(selectedDate.month + 1).toString().padStart(2, "0")}/${selectedDate.year} (${month.amharic})`
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Date Input Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>{formatDisplayDate()}</span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Today's Date</span>
            </div>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium text-green-700">E.C.:</span>{" "}
                <span className="text-gray-900">{currentEthiopianDate.formatted}</span>{" "}
                <span className="text-gray-600">({ETHIOPIAN_MONTHS[currentEthiopianDate.month - 1]?.amharic})</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-blue-700">G.C.:</span>{" "}
                <span className="text-gray-900">{currentGregorianDate.formatted}</span>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateMonth("prev")} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <div className="font-semibold text-lg text-gray-900">{ETHIOPIAN_MONTHS[currentMonth].amharic}</div>
              <div className="text-sm text-gray-600">
                {ETHIOPIAN_MONTHS[currentMonth].name} {currentYear}
              </div>
            </div>

            <button onClick={() => navigateMonth("next")} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Day headers */}
            {["እሑድ", "ሰኞ", "ማክሰ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {renderCalendarDays()}
          </div>

          <div className="mb-3">
            <button
              onClick={() => {
                setCurrentYear(currentEthiopianDate.year)
                setCurrentMonth(currentEthiopianDate.month - 1)
                handleDateSelect(currentEthiopianDate.day)
              }}
              className="w-full px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Go to Today (E.C.)
            </button>
          </div>

          {/* Quick Month Selection */}
          <div className="border-t pt-3">
            <div className="text-xs font-medium text-gray-700 mb-2">Quick Select: Full Year</div>
            <div className="grid grid-cols-4 gap-1">
              {ETHIOPIAN_MONTHS.slice(0, 12).map((month, index) => {
                const isCurrent = index === currentEthiopianDate.month - 1
                const isSelected = currentMonth === index

                return (
                  <button
                    key={month.name}
                    onClick={() => {
                      setCurrentMonth(index)
                      handleDateSelect(1) // Select first day of month
                    }}
                    className={`
                      text-xs px-2 py-1 rounded transition-colors
                      ${
                        isSelected
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : isCurrent
                            ? "bg-green-100 text-green-800 font-medium border border-green-300"
                            : "hover:bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {month.amharic}
                    {isCurrent && <span className="ml-1 text-green-600">●</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Close button */}
          <div className="border-t pt-3 mt-3">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

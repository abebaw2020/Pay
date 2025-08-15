"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { InputDataEntry } from "../types/inputData"

interface InputDataContextType {
  entries: InputDataEntry[]
  setEntries: (entries: InputDataEntry[]) => void
  getEntriesForMonth: (monthName: string, year: number) => InputDataEntry[]
}

const InputDataContext = createContext<InputDataContextType | undefined>(undefined)

export const useInputData = () => {
  const context = useContext(InputDataContext)
  if (!context) {
    throw new Error("useInputData must be used within an InputDataProvider")
  }
  return context
}

export const InputDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntriesState] = useState<InputDataEntry[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("inputDataEntries")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Convert date strings back to Date objects
        const entriesWithDates = parsedData.map((entry: any) => ({
          ...entry,
          receiptDate: new Date(entry.receiptDate),
        }))
        setEntriesState(entriesWithDates)
      } catch (error) {
        console.error("Error loading input data:", error)
      }
    }
  }, [])

  // Save data to localStorage whenever entries change
  const setEntries = (newEntries: InputDataEntry[]) => {
    setEntriesState(newEntries)
    localStorage.setItem("inputDataEntries", JSON.stringify(newEntries))
  }

  // Get entries for a specific Ethiopian month and year
  const getEntriesForMonth = (monthName: string, year: number) => {
    return entries.filter((entry) => entry.month === monthName && entry.year === year)
  }

  return (
    <InputDataContext.Provider value={{ entries, setEntries, getEntriesForMonth }}>
      {children}
    </InputDataContext.Provider>
  )
}

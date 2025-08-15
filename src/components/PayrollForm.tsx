"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Play, Settings, Calendar, CheckCircle2, Clock } from "lucide-react"
import type { CustomRates, CustomExpense } from "../types/payroll"
import { EthiopianDatePicker } from "./EthiopianDatePicker"
import { useInputData } from "../contexts/InputDataContext"
import { ChevronDown, FileText } from "lucide-react"
import { formatCurrency } from "../utils/currencyFormatter"
import {
  getEthiopianMonthFromDate,
  generateFullMonthRange,
  getCurrentEthiopianDate,
  ethiopianMonths,
  gregorianToEthiopian,
} from "../utils/ethiopianCalendar"

interface PayrollFormProps {
  onGenerateReport: (
    income: number,
    startDate: Date,
    endDate: Date,
    customRates: CustomRates,
    customExpenses: CustomExpense[],
  ) => void
}

const PayrollForm: React.FC<PayrollFormProps> = ({ onGenerateReport }) => {
  const { getEntriesForMonth } = useInputData()
  const [income, setIncome] = useState("")
  const [selectedIncomeEntry, setSelectedIncomeEntry] = useState<string>("")

  const currentEthiopian = getCurrentEthiopianDate()
  const currentMonthRange = generateFullMonthRange(currentEthiopian.year, currentEthiopian.month)
  const [startDate, setStartDate] = useState(currentMonthRange.start)
  const [endDate, setEndDate] = useState(currentMonthRange.end)
  const [selectedMonth, setSelectedMonth] = useState<string>(ethiopianMonths[currentEthiopian.month - 1]?.name || "ሰኔ")

  const [hasSelectedMonth, setHasSelectedMonth] = useState(false)

  const [customRates, setCustomRates] = useState<CustomRates>({
    gmRate: 500,
    gmDays: 15,
    laborRate: 700,
    laborDays: 4,
    laborWeeks: 4,
    transportRate: 200,
    transportDays: 15,
  })

  const setFullMonth = (year: number, month: number, monthName: string) => {
    const { start, end } = generateFullMonthRange(year, month)
    setStartDate(start)
    setEndDate(end)
    setSelectedMonth(monthName)
    setHasSelectedMonth(true)
    setSelectedIncomeEntry("")
    setIncome("")
  }

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate)
    if (hasSelectedMonth) {
      const month = getEthiopianMonthFromDate(newStartDate)
      if (month) {
        setSelectedMonth(month.amharic)
        const startDateObj = new Date(newStartDate)
        const year = startDateObj.getFullYear()
        const monthNum = startDateObj.getMonth() + 1
        const daysInMonth = new Date(year, monthNum, 0).getDate()
        const newEndDate = `${year}-${monthNum.toString().padStart(2, "0")}-${daysInMonth.toString().padStart(2, "0")}`
        setEndDate(newEndDate)
        setSelectedIncomeEntry("")
        setIncome("")
      }
    }
  }

  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate)
    if (hasSelectedMonth) {
      const month = getEthiopianMonthFromDate(newEndDate)
      if (month) {
        setSelectedMonth(month.amharic)
        setSelectedIncomeEntry("")
        setIncome("")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const incomeAmount = Number.parseFloat(income) || 0
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      alert("Please enter valid start and end dates.")
      return
    }

    const currentEthiopian = getCurrentEthiopianDate()
    const selectedEthiopianMonth = ethiopianMonths.find((m) => m.name === selectedMonth)
    const customExpenses = selectedEthiopianMonth
      ? getEntriesForMonth(selectedEthiopianMonth.name, currentEthiopian.year)
          .filter((entry) => entry.type === "expense")
          .map((entry) => ({
            id: entry.id,
            description: entry.incomeFrom,
            amount: entry.income,
            category: entry.category || "Other",
          }))
      : []

    onGenerateReport(incomeAmount, start, end, customRates, customExpenses)
  }

  const updateCustomRate = (field: keyof CustomRates, value: string) => {
    setCustomRates((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }))
  }

  const getSelectedMonth = (startDate: string, endDate: string) => {
    return selectedMonth
  }

  const formatEthiopianDateRange = (startDate: string, endDate: string) => {
    const selectedEthiopianMonth = getSelectedMonth(startDate, endDate)
    const ethiopianMonth = ethiopianMonths.find((m) => m.name === selectedEthiopianMonth)

    if (ethiopianMonth) {
      const currentYear = getCurrentEthiopianDate().year
      const monthNumber = ethiopianMonth.number
      const daysInMonth = ethiopianMonth.days || 30

      const startEthiopian = `01/${monthNumber.toString().padStart(2, "0")}/${currentYear}`
      const endEthiopian = `${daysInMonth.toString().padStart(2, "0")}/${monthNumber.toString().padStart(2, "0")}/${currentYear}`

      return {
        start: startEthiopian,
        end: endEthiopian,
        year: currentYear,
      }
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const ethiopianStart = gregorianToEthiopian(start)
    const ethiopianEnd = gregorianToEthiopian(end)

    const formatEthiopianDate = (eth: { year: number; month: number; day: number }) => {
      return `${eth.day.toString().padStart(2, "0")}/${eth.month.toString().padStart(2, "0")}/${eth.year}`
    }

    return {
      start: formatEthiopianDate(ethiopianStart),
      end: formatEthiopianDate(ethiopianEnd),
      year: ethiopianStart.year,
    }
  }

  const availableIncomeEntries = useMemo(() => {
    if (!hasSelectedMonth) return []

    const currentEthiopian = getCurrentEthiopianDate()
    return getEntriesForMonth(selectedMonth, currentEthiopian.year).filter((entry) => entry.type === "income")
  }, [selectedMonth, hasSelectedMonth, getEntriesForMonth])

  const calculateMonthlyTotal = () => {
    return availableIncomeEntries.reduce((total, entry) => total + entry.income, 0)
  }

  const handleIncomeSelectionChange = (value: string) => {
    setSelectedIncomeEntry(value)

    if (value === "total") {
      setIncome(calculateMonthlyTotal().toString())
    } else {
      const selectedEntry = availableIncomeEntries.find((entry) => entry.id === value)
      if (selectedEntry) {
        setIncome(selectedEntry.income.toString())
      }
    }
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold text-card-foreground">Generate Payroll Report</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Configure your payroll period and generate comprehensive reports
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary rounded-xl shadow-sm">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-serif text-2xl font-bold text-foreground">Quick Month Selection</h4>
              <p className="text-muted-foreground font-medium">Ethiopian Calendar • 2017 E.C.</p>
            </div>
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border mb-8">
            <p className="text-card-foreground text-center">
              {!hasSelectedMonth
                ? "Please select a month below to begin configuring your payroll period"
                : "Select any month to automatically configure the complete payroll period with accurate Ethiopian calendar dates"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {ethiopianMonths.map((month) => {
              const isSelected = getSelectedMonth(startDate, endDate) === month.name
              const isCurrent = month.number === currentEthiopian.month

              return (
                <button
                  key={month.number}
                  type="button"
                  onClick={() => setFullMonth(2017, month.number, month.name)}
                  className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-center overflow-hidden ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-105 ring-4 ring-primary/20"
                      : isCurrent
                        ? "bg-secondary/10 text-secondary border-secondary/30 hover:border-secondary/50 hover:shadow-md"
                        : "bg-card text-card-foreground border-border hover:border-border/60 hover:shadow-md hover:bg-muted/50"
                  } hover:transform hover:scale-102 active:scale-98`}
                >
                  <div className="relative z-10">
                    <div className={`font-bold text-lg mb-2`}>{month.name}</div>
                    <div className={`text-sm opacity-75 mb-3`}>Month {month.number} • 2017</div>

                    {isSelected && (
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Selected</span>
                      </div>
                    )}
                    {isCurrent && !isSelected && (
                      <div className="flex items-center justify-center gap-1 text-sm text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>Current</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {hasSelectedMonth && (
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-semibold text-lg">Selected Payroll Period</span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {getSelectedMonth(startDate, endDate)} ({(() => {
                  const ethiopianRange = formatEthiopianDateRange(startDate, endDate)
                  return `${ethiopianRange.start} to ${ethiopianRange.end} E.C.`
                })()})
              </div>
              <div className="opacity-90">Ethiopian Calendar • Full month period automatically configured</div>
            </div>
          )}
        </div>

        {hasSelectedMonth ? (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label htmlFor="income" className="block text-lg font-semibold text-foreground">
                  Total Income (Birr)
                </label>

                {availableIncomeEntries.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <select
                        value={selectedIncomeEntry}
                        onChange={(e) => handleIncomeSelectionChange(e.target.value)}
                        className="w-full px-5 py-4 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 appearance-none bg-background pr-12 text-foreground font-medium shadow-sm hover:shadow-md"
                      >
                        <option value="">Select Income Source</option>
                        <option value="total">All Entries Total ({formatCurrency(calculateMonthlyTotal())})</option>
                        {availableIncomeEntries.map((entry) => (
                          <option key={entry.id} value={entry.id}>
                            {entry.incomeFrom} - {formatCurrency(entry.income)} ({entry.receiptNumber})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground pointer-events-none" />
                    </div>

                    {selectedIncomeEntry === "" && (
                      <input
                        type="number"
                        id="income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="Select an income source above"
                        className="w-full px-5 py-4 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-muted text-muted-foreground"
                        step="0.01"
                        disabled
                      />
                    )}

                    {selectedIncomeEntry && selectedIncomeEntry !== "" && (
                      <div className="px-5 py-4 bg-secondary/10 border-2 border-secondary/20 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-secondary font-medium">Selected Amount:</span>
                          <span className="text-2xl font-bold text-secondary">
                            {formatCurrency(Number.parseFloat(income))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="number"
                      id="income"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="No income data available"
                      className="w-full px-5 py-4 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-muted text-muted-foreground"
                      step="0.01"
                      disabled
                    />
                    <div className="bg-destructive/10 border-2 border-destructive/20 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-destructive" />
                        <span className="text-destructive font-medium">
                          No income data found for {selectedMonth}. Add entries in the Input Data section first.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <EthiopianDatePicker
                value={startDate}
                onChange={handleStartDateChange}
                label="Payroll Start Date (E.C.)"
                placeholder="Select start date"
              />

              <EthiopianDatePicker
                value={endDate}
                onChange={handleEndDateChange}
                label="Payroll End Date (E.C.)"
                placeholder="Select end date"
              />
            </div>

            <details className="group border-t border-border pt-8">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors duration-200">
                  <div className="p-2 bg-muted-foreground/10 rounded-lg">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Customize Rates & Work Days</h3>
                    <p className="text-muted-foreground text-sm">
                      Optional configuration for custom payroll calculations
                    </p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground ml-auto group-open:rotate-180 transition-transform duration-200" />
                </div>
              </summary>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 p-6 bg-muted rounded-xl">
                <div>
                  <label htmlFor="gmRate" className="block text-sm font-semibold text-foreground mb-2">
                    GM Daily Rate (Birr)
                  </label>
                  <input
                    type="number"
                    id="gmRate"
                    value={customRates.gmRate}
                    onChange={(e) => updateCustomRate("gmRate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor="gmDays" className="block text-sm font-semibold text-foreground mb-2">
                    GM Payment Days per Period
                  </label>
                  <input
                    type="number"
                    id="gmDays"
                    value={customRates.gmDays}
                    onChange={(e) => updateCustomRate("gmDays", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background"
                    min="1"
                  />
                </div>

                <div>
                  <label htmlFor="laborRate" className="block text-sm font-semibold text-foreground mb-2">
                    Laborer Daily Rate (Birr)
                  </label>
                  <input
                    type="number"
                    id="laborRate"
                    value={customRates.laborRate}
                    onChange={(e) => updateCustomRate("laborRate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor="laborDays" className="block text-sm font-semibold text-foreground mb-2">
                    Laborer Work Days per Week
                  </label>
                  <input
                    type="number"
                    id="laborDays"
                    value={customRates.laborDays}
                    onChange={(e) => updateCustomRate("laborDays", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background"
                    min="1"
                    max="7"
                  />
                </div>

                <div>
                  <label htmlFor="laborWeeks" className="block text-sm font-semibold text-foreground mb-2">
                    Number of Weeks
                  </label>
                  <input
                    type="number"
                    id="laborWeeks"
                    value={customRates.laborWeeks}
                    onChange={(e) => updateCustomRate("laborWeeks", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background"
                    min="1"
                  />
                </div>

                <div>
                  <label htmlFor="transportRate" className="block text-sm font-semibold text-foreground mb-2">
                    Transport Daily Rate (Birr)
                  </label>
                  <input
                    type="number"
                    id="transportRate"
                    value={customRates.transportRate}
                    onChange={(e) => updateCustomRate("transportRate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label htmlFor="transportDays" className="block text-sm font-semibold text-foreground mb-2">
                    Transport Payment Days
                  </label>
                  <input
                    type="number"
                    id="transportDays"
                    value={customRates.transportDays}
                    onChange={(e) => updateCustomRate("transportDays", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 bg-background"
                    min="1"
                  />
                </div>
              </div>
            </details>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border">
              <button
                type="submit"
                className="group relative w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
              >
                <Play className="w-6 h-6" />
                <span className="text-xl">Generate Payroll Report</span>
              </button>
              <p className="text-muted-foreground text-center mt-4 font-medium">
                Click to generate detailed payroll report for {selectedMonth}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-2xl border-2 border-dashed border-border">
            <Calendar className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Select a Month to Continue</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
              Choose a month from the Quick Month Selection above to configure your payroll period and access all form
              fields.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default PayrollForm

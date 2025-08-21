import { formatDate } from "./formatters"
import type { PayrollData, PayrollEntry, CustomRates, PayrollPeriodResult, CustomExpense } from "../types/payroll"

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function generatePayrollData(startDate: Date, endDate: Date, customRates: CustomRates, customExpenses: CustomExpense[] = []): PayrollData {
  const data = {
    gm: [] as PayrollEntry[],
    laborer1: [] as PayrollEntry[],
    laborer2: [] as PayrollEntry[],
    transport: [] as PayrollEntry[],
    customExpenses: customExpenses,
  }

  const totals = { gm: 0, laborer1: 0, laborer2: 0, transport: 0, customExpenses: 0, overall: 0 }
  const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1

  for (let i = 0; i < Math.ceil(duration / customRates.gmDays); i++) {
    const periodStart = addDays(startDate, i * customRates.gmDays)
    const periodEnd = addDays(periodStart, customRates.gmDays - 1)
    if (periodEnd <= endDate) {
      const payment = customRates.gmRate * customRates.gmDays
      data.gm.push({
        paymentDate: formatDate(addDays(periodEnd, 1)),
        description: `Payment ${formatDate(periodStart)} - ${formatDate(periodEnd)}`,
        rate: `${customRates.gmRate.toFixed(2)}/day`,
        days: customRates.gmDays,
        total: payment,
      })
      totals.gm += payment
    }
  }

  const weeklyPay = customRates.laborRate * customRates.laborDays

  for (let week = 0; week < customRates.laborWeeks; week++) {
    const weekStart = addDays(startDate, week * 7)
    const weekEnd = addDays(weekStart, customRates.laborDays - 1)

    if (weekEnd <= endDate) {
      const paymentDate1 = weekEnd <= endDate ? formatDate(addDays(weekEnd, 1)) : "N/A"
      const paymentDate2 = weekEnd <= endDate ? formatDate(addDays(weekEnd, 2)) : "N/A"

      const weekEntry = {
        workWeek: `Week ${week + 1}`,
        description: "Weekly Wage",
        rate: `${customRates.laborRate.toFixed(2)}/day`,
        days: customRates.laborDays,
        total: weeklyPay,
      }

      data.laborer1.push({ ...weekEntry, paymentDate: paymentDate1 })
      data.laborer2.push({ ...weekEntry, paymentDate: paymentDate2 })
    }
  }

  totals.laborer1 = data.laborer1.length * weeklyPay
  totals.laborer2 = data.laborer2.length * weeklyPay

  const availableDays: Date[] = []
  for (let i = 0; i < duration; i++) {
    const day = addDays(startDate, i)
    if (day.getDay() !== 0) availableDays.push(day) // Exclude Sundays
  }

  // Randomly select transport days based on custom transport days
  availableDays.sort(() => 0.5 - Math.random())
  const selectedDays = availableDays.slice(0, customRates.transportDays).sort((a, b) => a.getTime() - b.getTime())

  selectedDays.forEach((day) => {
    data.transport.push({
      paymentDate: formatDate(day),
      description: "Daily Transport Fee",
      rate: `${customRates.transportRate.toFixed(2)}/day`,
      total: customRates.transportRate,
    })
    totals.transport += customRates.transportRate
  })

  // Calculate custom expenses total
  totals.customExpenses = customExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  totals.overall = totals.gm + totals.laborer1 + totals.laborer2 + totals.transport + totals.customExpenses

  return { data, totals, duration }
}

export function generateSinglePeriodPayrollData(
  incomeAmount: number,
  startDate: Date,
  endDate: Date,
  customRates: CustomRates,
  customExpenses: CustomExpense[] = [],
): PayrollPeriodResult {
  const payrollData = generatePayrollData(startDate, endDate, customRates, customExpenses)
  const netProfit = incomeAmount - payrollData.totals.overall

  return {
    ...payrollData,
    id: `single-${Date.now()}`,
    incomeAmount,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    netProfit,
  }
}

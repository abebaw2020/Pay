export interface PayrollEntry {
  paymentDate: string
  description: string
  rate: string
  days?: number
  workWeek?: string
  total: number
}

export interface PayrollTotals {
  gm: number
  laborer1: number
  laborer2: number
  transport: number
  customExpenses: number
  overall: number
}

export interface PayrollData {
  data: {
    gm: PayrollEntry[]
    laborer1: PayrollEntry[]
    laborer2: PayrollEntry[]
    transport: PayrollEntry[]
    customExpenses: CustomExpense[]
  }
  totals: PayrollTotals
  duration: number
}

export interface CustomExpense {
  id: string
  description: string
  amount: number
  category?: string
}

export interface CustomRates {
  gmRate: number
  gmDays: number
  laborRate: number
  laborDays: number
  laborWeeks: number
  transportRate: number
  transportDays: number
}

export interface PayrollPeriodResult extends PayrollData {
  id: string
  incomeAmount: number
  startDate: string
  endDate: string
  netProfit: number
}

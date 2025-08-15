export interface InputDataEntry {
  id: string
  rawNo: number
  receiptDate: Date
  receiptNumber: string
  incomeFrom: string
  income: number
  month: string // Ethiopian month name
  year: number // Ethiopian year
  type: "income" | "expense"
  category?: string // For expense categorization
}

export interface GroupedInputData {
  [monthYear: string]: InputDataEntry[]
}

export interface InputDataState {
  entries: InputDataEntry[]
  groupedData: GroupedInputData
}

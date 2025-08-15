"use client"

import { useState, useMemo } from "react"
import { Plus, Upload, Download, Calendar, DollarSign, FileText, Trash2, Edit3 } from "lucide-react"
import { formatCurrency } from "../utils/formatters"
import {
  getEthiopianMonthName,
  gregorianToEthiopian,
  formatEthiopianDate,
  ethiopianToGregorian,
} from "../utils/ethiopianCalendar"
import type { InputDataEntry, GroupedInputData } from "../types/inputData"
import { useInputData } from "../contexts/InputDataContext"
import { EthiopianDatePicker } from "./EthiopianDatePicker"

interface InputDataTableProps {
  onDataChange?: (entries: InputDataEntry[]) => void
}

export default function InputDataTable() {
  const { entries, setEntries } = useInputData()
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [entryType, setEntryType] = useState<"income" | "expense">("income")
  const [newEntry, setNewEntry] = useState<Partial<InputDataEntry>>({
    receiptDate: new Date(),
    receiptNumber: "",
    incomeFrom: "",
    income: 0,
    type: "income",
  })

  // Group entries by Ethiopian month and year
  const groupedData: GroupedInputData = useMemo(() => {
    const grouped: GroupedInputData = {}

    entries.forEach((entry) => {
      const ethiopianDate = gregorianToEthiopian(entry.receiptDate)
      const monthYear = `${getEthiopianMonthName(ethiopianDate.month)} ${ethiopianDate.year}`

      if (!grouped[monthYear]) {
        grouped[monthYear] = []
      }
      grouped[monthYear].push(entry)
    })

    // Sort entries within each group by receipt date
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.receiptDate.getTime() - b.receiptDate.getTime())
    })

    return grouped
  }, [entries])

  const handleAddEntry = () => {
    if (!newEntry.receiptDate || !newEntry.receiptNumber || !newEntry.incomeFrom || !newEntry.income) {
      return
    }

    const ethiopianDate = gregorianToEthiopian(newEntry.receiptDate)
    const entry: InputDataEntry = {
      id: Date.now().toString(),
      rawNo: entries.length + 1,
      receiptDate: newEntry.receiptDate,
      receiptNumber: newEntry.receiptNumber,
      incomeFrom: newEntry.incomeFrom,
      income: newEntry.income,
      month: getEthiopianMonthName(ethiopianDate.month),
      year: ethiopianDate.year,
      type: entryType,
      category: entryType === "expense" ? newEntry.category : undefined,
    }

    const updatedEntries = [...entries, entry]
    setEntries(updatedEntries)

    // Reset form
    setNewEntry({
      receiptDate: new Date(),
      receiptNumber: "",
      incomeFrom: "",
      income: 0,
      type: entryType,
    })
    setIsAddingNew(false)
  }

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    // Recalculate raw numbers
    const reNumberedEntries = updatedEntries.map((entry, index) => ({
      ...entry,
      rawNo: index + 1,
    }))
    setEntries(reNumberedEntries)
  }

  const handleEditEntry = (id: string) => {
    setEditingId(id)
  }

  const handleSaveEdit = (id: string, updatedEntry: Partial<InputDataEntry>) => {
    const updatedEntries = entries.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry))
    setEntries(updatedEntries)
    setEditingId(null)
  }

  const getTotalIncome = () => {
    return entries.filter((entry) => entry.type === "income").reduce((total, entry) => total + entry.income, 0)
  }

  const getTotalExpenses = () => {
    return entries.filter((entry) => entry.type === "expense").reduce((total, entry) => total + entry.income, 0)
  }

  const getMonthTotal = (monthEntries: InputDataEntry[], type: "income" | "expense") => {
    return monthEntries.filter((entry) => entry.type === type).reduce((total, entry) => total + entry.income, 0)
  }

  const expenseCategories = [
    "Office Supplies",
    "Transportation",
    "Utilities",
    "Equipment",
    "Maintenance",
    "Professional Services",
    "Other",
  ]

  const handleEthiopianDateChange = (ethiopianDateString: string) => {
    const [year, month, day] = ethiopianDateString.split("-").map(Number)
    const gregorianDate = ethiopianToGregorian(year, month, day)
    setNewEntry({ ...newEntry, receiptDate: gregorianDate })
  }

  const formatDateForPicker = (date: Date): string => {
    const ethiopianDate = gregorianToEthiopian(date)
    return `${ethiopianDate.year}-${ethiopianDate.month.toString().padStart(2, "0")}-${ethiopianDate.day.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-8 py-6 border-b rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl shadow-sm">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Input Data Management</h2>
              <p className="text-sm text-muted-foreground">
                Manage income entries and custom expenses grouped by Ethiopian calendar months
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-lg font-bold text-primary">{entries.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-lg font-bold text-secondary">{formatCurrency(getTotalIncome())}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(getTotalExpenses())}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-background rounded-xl p-1 border shadow-sm">
              <button
                onClick={() => setEntryType("income")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  entryType === "income"
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setEntryType("expense")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  entryType === "expense"
                    ? "bg-destructive text-destructive-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Expenses
              </button>
            </div>
            <button
              onClick={() => setIsAddingNew(true)}
              className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                entryType === "income" ? "bg-secondary hover:bg-secondary/90" : "bg-destructive hover:bg-destructive/90"
              }`}
            >
              <Plus className="w-4 h-4" />
              Add New {entryType === "income" ? "Income" : "Expense"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {isAddingNew && (
        <div className={`px-8 py-6 border-b ${entryType === "income" ? "bg-secondary/5" : "bg-destructive/5"}`}>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
            Add New {entryType === "income" ? "Income Entry" : "Custom Expense"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {entryType === "income" ? "Receipt Date (E.C.)" : "Expense Date (E.C.)"}
              </label>
              <EthiopianDatePicker
                value={formatDateForPicker(newEntry.receiptDate || new Date())}
                onChange={handleEthiopianDateChange}
                label=""
                placeholder="Select Ethiopian date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {entryType === "income" ? "Receipt Number" : "Reference Number"}
              </label>
              <input
                type="text"
                value={newEntry.receiptNumber || ""}
                onChange={(e) => setNewEntry({ ...newEntry, receiptNumber: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background"
                placeholder={entryType === "income" ? "e.g., RCP-001" : "e.g., EXP-001"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {entryType === "income" ? "Income From" : "Expense Description"}
              </label>
              <input
                type="text"
                value={newEntry.incomeFrom || ""}
                onChange={(e) => setNewEntry({ ...newEntry, incomeFrom: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background"
                placeholder={entryType === "income" ? "e.g., Client Payment" : "e.g., Office Supplies"}
              />
            </div>
            {entryType === "expense" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select
                  value={newEntry.category || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background"
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {entryType === "income" ? "Income (Birr)" : "Amount (Birr)"}
              </label>
              <input
                type="number"
                value={newEntry.income || ""}
                onChange={(e) => setNewEntry({ ...newEntry, income: Number.parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAddEntry}
              className={`px-6 py-2 text-white rounded-lg transition-colors shadow-sm hover:shadow-md ${
                entryType === "income" ? "bg-secondary hover:bg-secondary/90" : "bg-destructive hover:bg-destructive/90"
              }`}
            >
              Add {entryType === "income" ? "Income" : "Expense"}
            </button>
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="px-6 py-4">
        {Object.keys(groupedData).length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Entries</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first income or expense entry to see the data table.
            </p>
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedData).map(([monthYear, monthEntries]) => {
              const incomeEntries = monthEntries.filter((entry) => entry.type === "income")
              const expenseEntries = monthEntries.filter((entry) => entry.type === "expense")

              return (
                <div key={monthYear} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Month Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{monthYear}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {incomeEntries.length} income
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {expenseEntries.length} expenses
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(getMonthTotal(monthEntries, "income"))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-red-600" />
                          <span className="text-lg font-bold text-red-600">
                            -{formatCurrency(getMonthTotal(monthEntries, "expense"))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {incomeEntries.length > 0 && (
                    <div className="border-b border-gray-200">
                      <div className="bg-green-50 px-4 py-2">
                        <h4 className="font-medium text-green-800">Income Entries</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Raw No
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Receipt Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Receipt Number
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Income From
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Income (Birr)
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {incomeEntries.map((entry) => (
                              <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.rawNo}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {(() => {
                                    const ethiopianDate = gregorianToEthiopian(entry.receiptDate)
                                    return formatEthiopianDate(ethiopianDate)
                                  })()}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{entry.receiptNumber}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{entry.incomeFrom}</td>
                                <td className="px-4 py-3 text-sm font-medium text-green-600">
                                  {formatCurrency(entry.income)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditEntry(entry.id)}
                                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteEntry(entry.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {expenseEntries.length > 0 && (
                    <div>
                      <div className="bg-red-50 px-4 py-2">
                        <h4 className="font-medium text-red-800">Custom Expenses</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Raw No
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expense Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reference
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount (Birr)
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {expenseEntries.map((entry) => (
                              <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.rawNo}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {(() => {
                                    const ethiopianDate = gregorianToEthiopian(entry.receiptDate)
                                    return formatEthiopianDate(ethiopianDate)
                                  })()}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{entry.receiptNumber}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{entry.incomeFrom}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                    {entry.category || "Other"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-red-600">
                                  {formatCurrency(entry.income)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleEditEntry(entry.id)}
                                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteEntry(entry.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

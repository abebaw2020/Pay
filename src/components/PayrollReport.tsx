"use client"

import type React from "react"
import { useState } from "react"
import { Download, Printer, FileText, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { formatCurrency } from "../utils/formatters"
import type { PayrollPeriodResult, CustomExpense } from "../types/payroll"
import PayrollTable from "./PayrollTable"
import { formatEthiopianDate, gregorianToEthiopian } from "../utils/ethiopianCalendar"

interface PayrollReportProps {
  payrollData: PayrollPeriodResult
  income: number
  startDate: Date
  endDate: Date
}

const PayrollReport: React.FC<PayrollReportProps> = ({ payrollData, income, startDate, endDate }) => {
  const [showDetails, setShowDetails] = useState(true)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a simple CSV export
    const csvContent = [
      ["Category", "Description", "Amount"],
      ["Income", "Total Income", income.toString()],
      ["GM Expenses", "General Manager", payrollData.totals.gm.toString()],
      ["Laborer 1", "First Laborer", payrollData.totals.laborer1.toString()],
      ["Laborer 2", "Second Laborer", payrollData.totals.laborer2.toString()],
      ["Transport", "Transportation", payrollData.totals.transport.toString()],
      ["Custom Expenses", "Additional Expenses", payrollData.totals.customExpenses?.toString() || "0"],
      ["Net Profit", "Final Profit", payrollData.netProfit.toString()],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payroll-report-${payrollData.startDate}-to-${payrollData.endDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDateRange = () => {
    const startEthiopian = gregorianToEthiopian(startDate)
    const endEthiopian = gregorianToEthiopian(endDate)
    return `${formatEthiopianDate(startEthiopian)} - ${formatEthiopianDate(endEthiopian)}`
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm border">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-8 py-6 border-b rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl shadow-sm">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Payroll Report</h2>
              <p className="text-sm text-muted-foreground">
                Period: {formatDateRange()} • Duration: {payrollData.duration} days
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-8 py-6 border-b bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-green-800">Total Income</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(income)}</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-red-800">Total Expenses</span>
            </div>
            <div className="text-2xl font-bold text-red-700">{formatCurrency(payrollData.totals.overall)}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-blue-800">Net Profit</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(payrollData.netProfit)}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-purple-800">Profit Margin</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {income > 0 ? ((payrollData.netProfit / income) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      {showDetails && (
        <div className="px-8 py-6 space-y-6">
          {/* GM Table */}
          {payrollData.data.gm.length > 0 && (
            <PayrollTable
              title="General Manager Payments"
              data={payrollData.data.gm}
              total={payrollData.totals.gm}
              headers={["Payment Date", "Description", "Rate", "Days", "Total"]}
              renderRow={(item) => [
                item.paymentDate,
                item.description,
                item.rate,
                item.days?.toString() || "-",
                formatCurrency(item.total),
              ]}
            />
          )}

          {/* Laborer 1 Table */}
          {payrollData.data.laborer1.length > 0 && (
            <PayrollTable
              title="First Laborer Payments"
              data={payrollData.data.laborer1}
              total={payrollData.totals.laborer1}
              headers={["Payment Date", "Work Week", "Description", "Rate", "Days", "Total"]}
              renderRow={(item) => [
                item.paymentDate,
                item.workWeek || "-",
                item.description,
                item.rate,
                item.days?.toString() || "-",
                formatCurrency(item.total),
              ]}
            />
          )}

          {/* Laborer 2 Table */}
          {payrollData.data.laborer2.length > 0 && (
            <PayrollTable
              title="Second Laborer Payments"
              data={payrollData.data.laborer2}
              total={payrollData.totals.laborer2}
              headers={["Payment Date", "Work Week", "Description", "Rate", "Days", "Total"]}
              renderRow={(item) => [
                item.paymentDate,
                item.workWeek || "-",
                item.description,
                item.rate,
                item.days?.toString() || "-",
                formatCurrency(item.total),
              ]}
            />
          )}

          {/* Transport Table */}
          {payrollData.data.transport.length > 0 && (
            <PayrollTable
              title="Transportation Expenses"
              data={payrollData.data.transport}
              total={payrollData.totals.transport}
              headers={["Payment Date", "Description", "Rate", "Total"]}
              renderRow={(item) => [item.paymentDate, item.description, item.rate, formatCurrency(item.total)]}
            />
          )}

          {/* Custom Expenses Table */}
          {payrollData.data.customExpenses && payrollData.data.customExpenses.length > 0 && (
            <PayrollTable
              title="Custom Expenses"
              data={payrollData.data.customExpenses}
              total={payrollData.totals.customExpenses || 0}
              headers={["Description", "Category", "Amount"]}
              renderRow={(item: CustomExpense) => [
                item.description,
                item.category || "Other",
                formatCurrency(item.amount),
              ]}
            />
          )}
        </div>
      )}

      {/* Report Footer */}
      <div className="px-8 py-6 border-t bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Payroll Hub • Business Management System
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayrollReport
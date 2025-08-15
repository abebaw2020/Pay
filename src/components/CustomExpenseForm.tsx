"use client"

import { useState } from "react"
import { Plus, Trash2, DollarSign } from "lucide-react"
import type { CustomExpense } from "../types/payroll"

interface CustomExpenseFormProps {
  expenses: CustomExpense[]
  onExpensesChange: (expenses: CustomExpense[]) => void
  title?: string
}

export default function CustomExpenseForm({
  expenses,
  onExpensesChange,
  title = "Custom Expenses",
}: CustomExpenseFormProps) {
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "" })

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense: CustomExpense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: Number.parseFloat(newExpense.amount),
        category: newExpense.category || "Other",
      }
      onExpensesChange([...expenses, expense])
      setNewExpense({ description: "", amount: "", category: "" })
    }
  }

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter((expense) => expense.id !== id))
  }

  const updateExpense = (id: string, field: keyof CustomExpense, value: string | number) => {
    onExpensesChange(expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Add New Expense */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            placeholder="e.g., Office Supplies"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Birr)</label>
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Utilities">Utilities</option>
            <option value="Equipment">Equipment</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={addExpense}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Existing Expenses */}
      {expenses.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-2">Current Expenses</h4>
          {expenses.map((expense) => (
            <div key={expense.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={expense.description}
                onChange={(e) => updateExpense(expense.id, "description", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => updateExpense(expense.id, "amount", Number.parseFloat(e.target.value) || 0)}
                step="0.01"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={expense.category || "Other"}
                onChange={(e) => updateExpense(expense.id, "category", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Office Supplies">Office Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Equipment">Equipment</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
              <button
                onClick={() => removeExpense(expense.id)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Custom Expenses:</span>
              <span className="font-bold text-blue-600">
                {expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)} Birr
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

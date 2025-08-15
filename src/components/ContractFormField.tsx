"use client"

import type React from "react"

interface ContractFormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  fillableMode: boolean
  placeholder?: string
  className?: string
  type?: "input" | "textarea"
  rows?: number
}

export const ContractFormField: React.FC<ContractFormFieldProps> = ({
  label,
  value,
  onChange,
  fillableMode,
  placeholder,
  className = "",
  type = "input",
  rows = 1,
}) => {
  if (type === "textarea") {
    return (
      <div className={className}>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {fillableMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-dotted border-gray-400 bg-transparent focus:border-blue-500 focus:outline-none px-2 py-2 rounded resize-none"
            rows={rows}
            placeholder={placeholder}
          />
        ) : (
          <div className="space-y-2">
            {Array.from({ length: rows }, (_, i) => (
              <div
                key={i}
                className={`border-b border-dotted border-gray-400 h-6 ${i === rows - 1 ? "w-3/4" : "w-full"}`}
              ></div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {fillableMode ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-b border-dotted border-gray-400 bg-transparent focus:border-blue-500 focus:outline-none px-1 py-1"
          placeholder={placeholder}
        />
      ) : (
        <div className="border-b border-dotted border-gray-400 h-6 w-full"></div>
      )}
    </div>
  )
}

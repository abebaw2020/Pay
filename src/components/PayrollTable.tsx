import type React from "react"
import { formatCurrency } from "../utils/formatters"

interface PayrollTableProps {
  title: string
  data: any[]
  total: number
  headers: string[]
  renderRow: (item: any) => string[]
}

const PayrollTable: React.FC<PayrollTableProps> = ({ title, data, total, headers, renderRow }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-600">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-semibold text-white border-r border-gray-400 last:border-r-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors duration-150`}
              >
                {renderRow(item).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 text-sm text-gray-900 border-b border-gray-200 border-r border-gray-200 last:border-r-0 ${
                      cellIndex === headers.length - 1 ? "text-right font-mono" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 border-t-2 border-gray-400">
              <td colSpan={headers.length - 1} className="px-4 py-3 font-bold text-gray-900 border-r border-gray-200">
                Total
              </td>
              <td className="px-4 py-3 text-right font-mono font-bold text-blue-600 text-base">
                {formatCurrency(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default PayrollTable

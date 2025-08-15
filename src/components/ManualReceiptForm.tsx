"use client"

import { useState } from "react"
import { Receipt, Printer, User } from "lucide-react"
import { ContractFormField } from "./ContractFormField"
import { usePrintContract } from "../hooks/usePrintContract"

interface ReceiptData {
  personalInfo: {
    name: string
    address: string
    kebele: string
    houseNumber: string
    fromPerson: string
  }
  payment: {
    amountInNumbers: string
    amountInWords: string
  }
  reason: string
  signatures: {
    payer: { name: string; signature: string; date: string }
    receiver: { name: string; signature: string; date: string }
  }
  witnesses: Array<{ name: string; signature: string }>
}

export const ManualReceiptForm = () => {
  const { printContract } = usePrintContract()
  const [fillableMode, setFillableMode] = useState(true)
  const [receiptData, setReceiptData] = useState<ReceiptData>({
    personalInfo: {
      name: "",
      address: "",
      kebele: "",
      houseNumber: "",
      fromPerson: "",
    },
    payment: {
      amountInNumbers: "",
      amountInWords: "",
    },
    reason: "",
    signatures: {
      payer: { name: "", signature: "", date: "" },
      receiver: { name: "", signature: "", date: "" },
    },
    witnesses: [
      { name: "", signature: "" },
      { name: "", signature: "" },
      { name: "", signature: "" },
    ],
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-6 border border-orange-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-md">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-orange-900 mb-1">ደረሰኝ የሌላቸው ልዩ ልዩ ወጭዎች የሚሠጥ ደረሰኝ</h3>
              <p className="text-sm text-orange-700 font-medium">Manual Receipt for Non-Receipt Expenses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-xl p-3 border border-orange-200 shadow-sm">
            <span className="text-sm font-semibold text-orange-700">Document Mode:</span>
            <div className="flex bg-orange-50 rounded-lg p-1">
              <button
                onClick={() => setFillableMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  fillableMode
                    ? "bg-orange-500 text-white shadow-md transform scale-105"
                    : "text-orange-600 hover:bg-orange-100"
                }`}
              >
                📝 Fillable
              </button>
              <button
                onClick={() => setFillableMode(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !fillableMode
                    ? "bg-orange-500 text-white shadow-md transform scale-105"
                    : "text-orange-600 hover:bg-orange-100"
                }`}
              >
                ✍️ Manual
              </button>
            </div>
          </div>
        </div>

        <div className="no-print flex gap-4">
          <button
            onClick={() => printContract("manual-receipt")}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
        </div>
      </div>

      <div
        id="manual-receipt"
        className="contract-page bg-white shadow-2xl mx-auto border border-gray-200 rounded-xl overflow-hidden"
        style={{
          width: "21cm",
          minHeight: "29.7cm",
          padding: "2cm 1.5cm",
          fontFamily: "'Noto Sans Ethiopic', 'Times New Roman', serif",
          lineHeight: "1.6",
          fontSize: "14px",
        }}
      >
        {/* Document Header */}
        <div className="text-center mb-8 pb-4 border-b-2 border-orange-500">
          <h1 className="text-xl font-bold text-orange-900 mb-2 tracking-wide">ደረሰኝ የሌላቸው ልዩ ልዩ ወጭዎች የሚሠጥ ደረሰኝ</h1>
          <p className="text-sm text-orange-700 font-medium italic">Manual Receipt for Non-Receipt Expenses</p>
        </div>

        {/* Personal Information Section */}
        <div className="bg-orange-50 rounded-lg p-5 mb-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">የግል መረጃ (Personal Information)</h3>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="space-y-3">
              <ContractFormField
                label="አዳ አዋ/ወ/ር/ወ/ዓት:"
                value={receiptData.personalInfo.name}
                onChange={(value) =>
                  setReceiptData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, name: value } }))
                }
                fillableMode={fillableMode}
                placeholder="ቀን/ወር/ዓመት"
              />
              <ContractFormField
                label="አድራሻ:"
                value={receiptData.personalInfo.address}
                onChange={(value) =>
                  setReceiptData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, address: value } }))
                }
                fillableMode={fillableMode}
              />
            </div>
            <div className="space-y-3">
              <ContractFormField
                label="ቁልፍ:"
                value={receiptData.personalInfo.kebele}
                onChange={(value) =>
                  setReceiptData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, kebele: value } }))
                }
                fillableMode={fillableMode}
              />
              <ContractFormField
                label="የቤት ቁጥር:"
                value={receiptData.personalInfo.houseNumber}
                onChange={(value) =>
                  setReceiptData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, houseNumber: value } }))
                }
                fillableMode={fillableMode}
              />
            </div>
          </div>

          <ContractFormField
            label="ከ:"
            value={receiptData.personalInfo.fromPerson}
            onChange={(value) =>
              setReceiptData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, fromPerson: value } }))
            }
            fillableMode={fillableMode}
            placeholder="ከማን የተቀበለ"
          />
        </div>

        {/* Payment Details Section */}
        <div className="bg-green-50 rounded-lg p-5 mb-6 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h3 className="font-semibold text-green-900">የክፍያ ዝርዝር (Payment Details)</h3>
          </div>

          <div className="space-y-4">
            <ContractFormField
              label="በቁጥር (Amount in Numbers):"
              value={receiptData.payment.amountInNumbers}
              onChange={(value) =>
                setReceiptData((prev) => ({ ...prev, payment: { ...prev.payment, amountInNumbers: value } }))
              }
              fillableMode={fillableMode}
              placeholder="0.00 ብር"
            />

            <ContractFormField
              label="በፊደል (Amount in Words):"
              value={receiptData.payment.amountInWords}
              onChange={(value) =>
                setReceiptData((prev) => ({ ...prev, payment: { ...prev.payment, amountInWords: value } }))
              }
              fillableMode={fillableMode}
              placeholder="ሺህ ብር"
            />
          </div>
        </div>

        {/* Reason Section */}
        <div className="bg-blue-50 rounded-lg p-5 mb-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h3 className="font-semibold text-blue-900">ምክንያት (Reason for Payment)</h3>
          </div>

          <ContractFormField
            label=""
            value={receiptData.reason}
            onChange={(value) => setReceiptData((prev) => ({ ...prev, reason: value }))}
            fillableMode={fillableMode}
            type="textarea"
            rows={3}
            placeholder="የክፍያው ምክንያት ዝርዝር..."
          />
        </div>

        {/* Signatures Section */}
        <div className="space-y-6 mb-8">
          <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="font-semibold text-purple-900">ፊርማዎች (Signatures)</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-purple-800">ከፋይ (Payer)</h4>
                <ContractFormField
                  label="ስም (Name):"
                  value={receiptData.signatures.payer.name}
                  onChange={(value) =>
                    setReceiptData((prev) => ({
                      ...prev,
                      signatures: { ...prev.signatures, payer: { ...prev.signatures.payer, name: value } },
                    }))
                  }
                  fillableMode={fillableMode}
                />
                <ContractFormField
                  label="ቀን (Date):"
                  value={receiptData.signatures.payer.date}
                  onChange={(value) =>
                    setReceiptData((prev) => ({
                      ...prev,
                      signatures: { ...prev.signatures, payer: { ...prev.signatures.payer, date: value } },
                    }))
                  }
                  fillableMode={fillableMode}
                />
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">ፊርማ (Signature):</span>
                  {fillableMode ? (
                    <div className="border border-dotted border-gray-400 h-16 rounded bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                      Signature Area
                    </div>
                  ) : (
                    <div className="border-b border-dotted border-gray-400 h-16"></div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-purple-800">ተቀባይ (Receiver)</h4>
                <ContractFormField
                  label="ስም (Name):"
                  value={receiptData.signatures.receiver.name}
                  onChange={(value) =>
                    setReceiptData((prev) => ({
                      ...prev,
                      signatures: { ...prev.signatures, receiver: { ...prev.signatures.receiver, name: value } },
                    }))
                  }
                  fillableMode={fillableMode}
                />
                <ContractFormField
                  label="ቀን (Date):"
                  value={receiptData.signatures.receiver.date}
                  onChange={(value) =>
                    setReceiptData((prev) => ({
                      ...prev,
                      signatures: { ...prev.signatures, receiver: { ...prev.signatures.receiver, date: value } },
                    }))
                  }
                  fillableMode={fillableMode}
                />
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">ፊርማ (Signature):</span>
                  {fillableMode ? (
                    <div className="border border-dotted border-gray-400 h-16 rounded bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                      Signature Area
                    </div>
                  ) : (
                    <div className="border-b border-dotted border-gray-400 h-16"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Witnesses Section */}
          <div className="bg-teal-50 rounded-lg p-5 border-l-4 border-teal-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                5
              </div>
              <h3 className="font-semibold text-teal-900">ምስክሮች (Witnesses)</h3>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {receiptData.witnesses.map((witness, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-medium text-teal-800">ምስክር {index + 1}</h4>
                  <ContractFormField
                    label="ስም (Name):"
                    value={witness.name}
                    onChange={(value) =>
                      setReceiptData((prev) => ({
                        ...prev,
                        witnesses: prev.witnesses.map((w, i) => (i === index ? { ...w, name: value } : w)),
                      }))
                    }
                    fillableMode={fillableMode}
                  />
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">ፊርማ (Signature):</span>
                    {fillableMode ? (
                      <div className="border border-dotted border-gray-400 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-500 text-xs">
                        Signature
                      </div>
                    ) : (
                      <div className="border-b border-dotted border-gray-400 h-12"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Date and Location */}
        <div className="text-center pt-6 border-t border-gray-300">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">ቀን (Date): </span>
              {fillableMode ? (
                <input
                  type="date"
                  className="border-b border-dotted border-gray-400 bg-transparent focus:border-orange-500 focus:outline-none px-1 py-1"
                />
              ) : (
                <span className="border-b border-dotted border-gray-400 inline-block w-32 h-6"></span>
              )}
            </div>
            <div>
              <span className="font-medium">ቦታ (Place): </span>
              {fillableMode ? (
                <input
                  type="text"
                  className="border-b border-dotted border-gray-400 bg-transparent focus:border-orange-500 focus:outline-none px-1 py-1"
                  placeholder="አዲስ አበባ"
                />
              ) : (
                <span className="border-b border-dotted border-gray-400 inline-block w-32 h-6"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Briefcase, Printer } from "lucide-react"
import { ContractFormField } from "./ContractFormField"
import { usePrintContract } from "../hooks/usePrintContract"

interface WorkContractData {
  contractGiver: { name: string; address: string; idNumber: string }
  contractReceiver: { name: string; address: string; kebele: string }
  workContent: string
  payment: string
  paymentMethod: string
  startDate: string
  endDate: string
  contractPeriod: string
  signatures: {
    giver: { name: string; signature: string }
    receiver: { name: string; signature: string }
  }
  witnesses: Array<{ name: string; signature: string }>
}

export const WorkContractForm = () => {
  const { printContract } = usePrintContract()
  const [fillableMode, setFillableMode] = useState(true)
  const [workData, setWorkData] = useState<WorkContractData>({
    contractGiver: { name: "", address: "", idNumber: "" },
    contractReceiver: { name: "", address: "", kebele: "" },
    workContent: "",
    payment: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    contractPeriod: "",
    signatures: {
      giver: { name: "", signature: "" },
      receiver: { name: "", signature: "" },
    },
    witnesses: [
      { name: "", signature: "" },
      { name: "", signature: "" },
      { name: "", signature: "" },
    ],
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-1">በህግ ፊት የሚፀና የስራ ውል ስምምነት</h3>
              <p className="text-sm text-blue-700 font-medium">Legal Work Agreement Contract</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-xl p-3 border border-blue-200 shadow-sm">
            <span className="text-sm font-semibold text-blue-700">Document Mode:</span>
            <div className="flex bg-blue-50 rounded-lg p-1">
              <button
                onClick={() => setFillableMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  fillableMode
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                📝 Fillable
              </button>
              <button
                onClick={() => setFillableMode(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !fillableMode
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                ✍️ Manual
              </button>
            </div>
          </div>
        </div>

        <div className="no-print flex gap-4">
          <button
            onClick={() => printContract("work-contract")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
          >
            <Printer className="w-5 h-5" />
            Print Contract
          </button>
        </div>
      </div>

      <div
        id="work-contract"
        className="contract-page bg-white shadow-2xl mx-auto border border-gray-200 rounded-xl overflow-hidden"
        style={{
          width: "21cm",
          minHeight: "29.7cm",
          padding: "1.8cm 1.5cm",
          fontFamily: "'Noto Sans Ethiopic', 'Times New Roman', serif",
          lineHeight: "1.5",
          fontSize: "13px",
        }}
      >
        {/* Document Header */}
        <div className="text-center mb-6 pb-4 border-b-2 border-blue-500">
          <h1 className="text-xl font-bold text-blue-900 mb-2 tracking-wide">በህግ ፊት የሚፀና የስራ ውል ስምምነት</h1>
          <p className="text-sm text-blue-700 font-medium italic">Legal Work Agreement Contract</p>
        </div>

        {/* Contract Parties Section */}
        <div className="grid grid-cols-1 gap-4 mb-5">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="font-semibold text-blue-900">ውል ሰጪ (Contract Giver - Employer)</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <ContractFormField
                label="ስም (Name):"
                value={workData.contractGiver.name}
                onChange={(value) =>
                  setWorkData((prev) => ({ ...prev, contractGiver: { ...prev.contractGiver, name: value } }))
                }
                fillableMode={fillableMode}
              />
              <ContractFormField
                label="አድራሻ (Address):"
                value={workData.contractGiver.address}
                onChange={(value) =>
                  setWorkData((prev) => ({ ...prev, contractGiver: { ...prev.contractGiver, address: value } }))
                }
                fillableMode={fillableMode}
              />
              <ContractFormField
                label="የመ/ቁ (ID No.):"
                value={workData.contractGiver.idNumber}
                onChange={(value) =>
                  setWorkData((prev) => ({ ...prev, contractGiver: { ...prev.contractGiver, idNumber: value } }))
                }
                fillableMode={fillableMode}
              />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="font-semibold text-green-900">ውል ተቀባይ (Contract Receiver - Employee)</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <ContractFormField
                label="ስም (Name):"
                value={workData.contractReceiver.name}
                onChange={(value) =>
                  setWorkData((prev) => ({ ...prev, contractReceiver: { ...prev.contractReceiver, name: value } }))
                }
                fillableMode={fillableMode}
              />
              <ContractFormField
                label="አድራሻ (Address):"
                value={workData.contractReceiver.address}
                onChange={(value) =>
                  setWorkData((prev) => ({ ...prev, contractReceiver: { ...prev.contractReceiver, address: value } }))
                }
                fillableMode={fillableMode}
              />
              <ContractFormField
                label="ቀበሌ (Kebele):"
                value={workData.contractReceiver.kebele}
                onChange={(value) =>
                  setWorkData((prev) => ({ ...prev, contractReceiver: { ...prev.contractReceiver, kebele: value } }))
                }
                fillableMode={fillableMode}
              />
            </div>
          </div>
        </div>

        {/* Work Details Section */}
        <div className="space-y-4 mb-5">
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="font-semibold text-purple-900">የሥራ ይዘት (Work Content)</h3>
            </div>
            <ContractFormField
              label=""
              value={workData.workContent}
              onChange={(value) => setWorkData((prev) => ({ ...prev, workContent: value }))}
              fillableMode={fillableMode}
              type="textarea"
              rows={3}
              placeholder="የሚሰራው ሥራ ዝርዝር..."
            />
          </div>

          {/* Contract Terms */}
          <div className="grid grid-cols-1 gap-3 text-sm">
            {/* Payment and other terms using inline fields for compact layout */}
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                4
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">ለሥራው የሚደረግ ክፍያ:</span>
                {fillableMode ? (
                  <input
                    type="text"
                    value={workData.payment}
                    onChange={(e) => setWorkData((prev) => ({ ...prev, payment: e.target.value }))}
                    className="ml-2 border-b border-dotted border-gray-400 bg-transparent focus:border-orange-500 focus:outline-none px-1 py-1 w-64"
                    placeholder="ብር"
                  />
                ) : (
                  <span className="ml-2 border-b border-dotted border-gray-400 inline-block w-64 h-6"></span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                5
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">የክፍያ ዘዴ:</span>
                {fillableMode ? (
                  <input
                    type="text"
                    value={workData.paymentMethod}
                    onChange={(e) => setWorkData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                    className="ml-2 border-b border-dotted border-gray-400 bg-transparent focus:border-orange-500 focus:outline-none px-1 py-1 w-64"
                    placeholder="ወርሃዊ/ሳምንታዊ/ዕለታዊ"
                  />
                ) : (
                  <span className="ml-2 border-b border-dotted border-gray-400 inline-block w-64 h-6"></span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                6
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">የስራ ጅምር ቀን:</span>
                {fillableMode ? (
                  <input
                    type="date"
                    value={workData.startDate}
                    onChange={(e) => setWorkData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="ml-2 border-b border-dotted border-gray-400 bg-transparent focus:border-orange-500 focus:outline-none px-1 py-1 w-64"
                  />
                ) : (
                  <span className="ml-2 border-b border-dotted border-gray-400 inline-block w-64 h-6"></span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                7
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">የስራ ማብቂያ ቀን:</span>
                {fillableMode ? (
                  <input
                    type="date"
                    value={workData.endDate}
                    onChange={(e) => setWorkData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="ml-2 border-b border-dotted border-gray-400 bg-transparent focus:border-orange-500 focus:outline-none px-1 py-1 w-64"
                  />
                ) : (
                  <span className="ml-2 border-b border-dotted border-gray-400 inline-block w-64 h-6"></span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                8
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">የውል ጊዜ:</span>
                {fillableMode ? (
                  <input
                    type="text"
                    value={workData.contractPeriod}
                    onChange={(e) => setWorkData((prev) => ({ ...prev, contractPeriod: e.target.value }))}
                    className="ml-2 border-b border-dotted border-gray-400 bg-transparent focus:border-orange-500 focus:outline-none px-1 py-1 w-64"
                    placeholder="ወር/ዓመት"
                  />
                ) : (
                  <span className="ml-2 border-b border-dotted border-gray-400 inline-block w-64 h-6"></span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                9
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">
                  ይህ ውል በሁለቱ ወገኖች መካከል በፈቃደኝነት የተደረገ ሲሆን በህግ ፊት ተፈፃሚ ይሆናል።
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                10
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">ውሉ በሁለቱ ወገኖች ፊርማ እና በምስክሮች ፊርማ የተረጋገጠ ነው።</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                11
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">ውሉ ከዚህ ቀን ጀምሮ ተፈፃሚ ይሆናል።</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="space-y-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-5 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                12
              </div>
              <h3 className="font-semibold text-indigo-900">ፊርማዎች (Signatures)</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-indigo-800">ውል ሰጪ (Contract Giver)</h4>
                <ContractFormField
                  label="ስም (Name):"
                  value={workData.signatures.giver.name}
                  onChange={(value) =>
                    setWorkData((prev) => ({
                      ...prev,
                      signatures: { ...prev.signatures, giver: { ...prev.signatures.giver, name: value } },
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
                <h4 className="font-medium text-indigo-800">ውል ተቀባይ (Contract Receiver)</h4>
                <ContractFormField
                  label="ስም (Name):"
                  value={workData.signatures.receiver.name}
                  onChange={(value) =>
                    setWorkData((prev) => ({
                      ...prev,
                      signatures: { ...prev.signatures, receiver: { ...prev.signatures.receiver, name: value } },
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
                13
              </div>
              <h3 className="font-semibold text-teal-900">ምስክሮች (Witnesses)</h3>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {workData.witnesses.map((witness, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-medium text-teal-800">ምስክር {index + 1}</h4>
                  <ContractFormField
                    label="ስም (Name):"
                    value={witness.name}
                    onChange={(value) =>
                      setWorkData((prev) => ({
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
                  className="border-b border-dotted border-gray-400 bg-transparent focus:border-blue-500 focus:outline-none px-1 py-1"
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
                  className="border-b border-dotted border-gray-400 bg-transparent focus:border-blue-500 focus:outline-none px-1 py-1"
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

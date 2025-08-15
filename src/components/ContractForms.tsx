"use client"

import { useState } from "react"
import { FileText, Briefcase, Receipt, Users, Calendar, DollarSign, User } from "lucide-react"
import { WorkContractForm } from "./WorkContractForm"
import { ManualReceiptForm } from "./ManualReceiptForm"

const ContractForms = () => {
  const [activeForm, setActiveForm] = useState<"work" | "receipt" | null>(null)

  const ContractSelection = () => (
    <div className="bg-card rounded-2xl shadow-sm border p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold text-card-foreground">Contract Forms</h2>
          <p className="text-muted-foreground text-sm mt-1">Create professional Ethiopian legal documents</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="group bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-primary rounded-xl shadow-sm">
              <Briefcase className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground">የስራ ውል ስምምነት</h3>
              <p className="text-sm text-muted-foreground">Work Agreement Contract</p>
            </div>
          </div>

          <p className="text-card-foreground mb-8 leading-relaxed">
            Create professional work agreements with employer/employee information, work details, payment terms, and
            legal obligations with witness signatures.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>Employer & Employee Details</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Work Terms & Duration</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 text-primary" />
              <span>Legal Obligations & Witnesses</span>
            </div>
          </div>

          <button
            onClick={() => setActiveForm("work")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <Briefcase className="w-5 h-5" />
            Create Work Contract
          </button>
        </div>

        <div className="group bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl p-8 border hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-xl shadow-sm">
              <Receipt className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground">የወጪ ደረሰኝ</h3>
              <p className="text-sm text-muted-foreground">Manual Receipt for Expenses</p>
            </div>
          </div>

          <p className="text-card-foreground mb-8 leading-relaxed">
            Generate manual receipts for expenses that don't have official receipts, including personal information,
            payment details, and witness signatures.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <User className="w-4 h-4 text-secondary" />
              <span>Personal Information & Address</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 text-secondary" />
              <span>Amount & Payment Details</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <FileText className="w-4 h-4 text-secondary" />
              <span>Signatures & Witnesses</span>
            </div>
          </div>

          <button
            onClick={() => setActiveForm("receipt")}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <Receipt className="w-5 h-5" />
            Create Manual Receipt
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      {activeForm === null && <ContractSelection />}
      {activeForm === "work" && <WorkContractForm />}
      {activeForm === "receipt" && <ManualReceiptForm />}

      {activeForm !== null && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveForm(null)}
            className="bg-muted hover:bg-muted/80 text-muted-foreground px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            ← Back to Selection
          </button>
        </div>
      )}
    </div>
  )
}

export default ContractForms

"use client"

import { useState, useEffect } from "react"
import {
  Calculator,
  FileText,
  BarChart3,
  Building2,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Menu,
  X,
  Home,
  Settings,
  HelpCircle,
  ChevronRight,
  Activity,
} from "lucide-react"
import PayrollForm from "../src/components/PayrollForm"
import ContractForms from "../src/components/ContractForms"
import InputDataTable from "../src/components/InputDataTable"
import { InputDataProvider } from "../src/contexts/InputDataContext"
import { generateSinglePeriodPayrollData } from "../src/utils/payrollCalculations"
import type { PayrollPeriodResult, CustomRates } from "../src/types/payroll"

// Import the missing PayrollReport component
import PayrollReport from "../src/components/PayrollReport"

export default function Page() {
  const [currentMode, setCurrentMode] = useState<"single" | "contracts" | "inputData">("single")
  const [singlePeriodData, setSinglePeriodData] = useState<PayrollPeriodResult | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGenerateSingleReport = async (
    income: number,
    startDate: Date,
    endDate: Date,
    customRates: CustomRates,
  ) => {
    setIsLoading(true)

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const payrollData = generateSinglePeriodPayrollData(income, startDate, endDate, customRates)
    setSinglePeriodData(payrollData)
    setIsLoading(false)
  }

  const switchMode = async (mode: "single" | "contracts" | "inputData") => {
    if (mode === currentMode) return

    setIsTransitioning(true)

    // Brief delay for transition effect
    await new Promise((resolve) => setTimeout(resolve, 200))

    setCurrentMode(mode)
    setSinglePeriodData(null)
    setSidebarOpen(false)

    // Complete transition
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const navigationItems = [
    {
      id: "single",
      title: "Payroll Calculator",
      subtitle: "Generate comprehensive reports",
      icon: Calculator,
      description: "Create detailed payroll calculations with customizable rates",
      color: "primary",
    },
    {
      id: "contracts",
      title: "Document Forms",
      subtitle: "Legal contract templates",
      icon: FileText,
      description: "Professional Ethiopian contract forms and receipts",
      color: "secondary",
    },
    {
      id: "inputData",
      title: "Data Management",
      subtitle: "Organize financial records",
      icon: BarChart3,
      description: "Manage income and expense data with analytics",
      color: "accent",
    },
  ]

  const currentNav = navigationItems.find((item) => item.id === currentMode)

  return (
    <InputDataProvider>
      <div
        className={`min-h-screen bg-background flex transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {/* Sidebar Navigation */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-sidebar-background border-r border-sidebar-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sidebar-primary rounded-lg shadow-sm animate-pulse">
                  <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-sidebar-foreground">Payroll Hub</h2>
                  <p className="text-xs text-sidebar-foreground/60">Business Management</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors duration-200"
              >
                <X className="w-5 h-5 text-sidebar-foreground" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
                  Main Features
                </h3>
                {navigationItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => switchMode(item.id as "single" | "contracts" | "inputData")}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all duration-300 text-left group hover:scale-[1.02] ${
                      currentMode === item.id
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg scale-[1.02]"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: mounted ? "slideInLeft 0.5s ease-out forwards" : "none",
                    }}
                  >
                    <item.icon
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 transition-transform duration-200 ${
                        currentMode === item.id ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm flex items-center justify-between">
                        {item.title}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 ${
                            currentMode === item.id ? "rotate-90" : "group-hover:translate-x-1"
                          }`}
                        />
                      </div>
                      <div
                        className={`text-xs mt-1 transition-colors duration-200 ${
                          currentMode === item.id ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/60"
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-sidebar-border pt-4">
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  {[
                    { icon: Home, label: "Dashboard" },
                    { icon: Settings, label: "Settings" },
                    { icon: HelpCircle, label: "Help & Support" },
                  ].map((action, index) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 hover:translate-x-1"
                      style={{
                        animationDelay: `${(index + 3) * 100}ms`,
                        animation: mounted ? "slideInLeft 0.5s ease-out forwards" : "none",
                      }}
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="bg-sidebar-accent rounded-lg p-3 hover:bg-sidebar-accent/80 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-sidebar-foreground">System Status</span>
                </div>
                <p className="text-xs text-sidebar-foreground/70">All systems operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar */}
          <header className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 backdrop-blur-sm bg-background/95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Menu className="w-5 h-5 text-foreground" />
                </button>

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 animate-in slide-in-from-left duration-500">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Payroll Hub</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-sm font-medium text-foreground">{currentNav?.title}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3">
                {isLoading && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full animate-pulse">
                    <Activity className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs font-medium text-primary">Processing...</span>
                  </div>
                )}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-muted-foreground">Active</span>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <div
            className={`bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b transition-all duration-500 ${isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
          >
            <div className="px-4 sm:px-6 lg:px-8 py-12">
              <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-6 animate-in slide-in-from-left duration-700">
                  {currentNav && (
                    <div className="p-3 bg-primary/10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <currentNav.icon className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                      {currentNav?.title || "Payroll Hub"}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      {currentNav?.description || "Your comprehensive business management solution"}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: TrendingUp, label: "Active Features", value: "3 modules available", color: "primary" },
                    { icon: Clock, label: "Last Updated", value: "Today", color: "secondary" },
                    { icon: Shield, label: "Security", value: "Fully compliant", color: "accent" },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer group"
                      style={{
                        animationDelay: `${index * 150}ms`,
                        animation: mounted ? "slideInUp 0.6s ease-out forwards" : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <stat.icon
                          className={`w-5 h-5 text-${stat.color} group-hover:scale-110 transition-transform duration-200`}
                        />
                        <div>
                          <div className="text-sm font-medium text-card-foreground">{stat.label}</div>
                          <div className="text-xs text-muted-foreground">{stat.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main
            className={`flex-1 px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ${isTransitioning ? "opacity-50 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            {/* Feature Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {currentMode === "single" && (
                <>
                  {[
                    {
                      icon: TrendingUp,
                      title: "Smart Calculations",
                      desc: "Automated payroll calculations with customizable rates for all employee categories and Ethiopian calendar integration.",
                      color: "primary",
                    },
                    {
                      icon: FileText,
                      title: "Detailed Reports",
                      desc: "Comprehensive payroll reports with payment dates, descriptions, rates, and net profit analysis.",
                      color: "secondary",
                    },
                    {
                      icon: Clock,
                      title: "Period Flexibility",
                      desc: "Generate reports for any date range with precise Ethiopian calendar support and custom work schedules.",
                      color: "accent",
                    },
                  ].map((card, index) => (
                    <div
                      key={card.title}
                      className="group bg-card rounded-xl p-6 border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: mounted ? "slideInUp 0.5s ease-out forwards" : "none",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`p-3 bg-${card.color}/10 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                        >
                          <card.icon className={`w-6 h-6 text-${card.color}`} />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-card-foreground">{card.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </>
              )}

              {currentMode === "contracts" && (
                <>
                  {[
                    {
                      icon: FileText,
                      title: "Ethiopian Forms",
                      desc: "Professional contract forms in Amharic with proper legal formatting and Ethiopian calendar support.",
                      color: "primary",
                    },
                    {
                      icon: Shield,
                      title: "Legal Compliance",
                      desc: "Includes signature blocks, witness sections, and all required legal elements for valid contracts.",
                      color: "secondary",
                    },
                    {
                      icon: Building2,
                      title: "Print Ready",
                      desc: "A4 formatted documents ready for printing with proper margins and professional business layout.",
                      color: "accent",
                    },
                  ].map((card, index) => (
                    <div
                      key={card.title}
                      className="group bg-card rounded-xl p-6 border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: mounted ? "slideInUp 0.5s ease-out forwards" : "none",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`p-3 bg-${card.color}/10 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                        >
                          <card.icon className={`w-6 h-6 text-${card.color}`} />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-card-foreground">{card.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </>
              )}

              {currentMode === "inputData" && (
                <>
                  {[
                    {
                      icon: BarChart3,
                      title: "Data Organization",
                      desc: "Organize and manage income entries with automatic Ethiopian calendar integration and monthly grouping.",
                      color: "primary",
                    },
                    {
                      icon: TrendingUp,
                      title: "Monthly Analysis",
                      desc: "View data grouped by Ethiopian calendar months with automatic totals and comprehensive analysis.",
                      color: "secondary",
                    },
                    {
                      icon: Users,
                      title: "Income Tracking",
                      desc: "Track income sources with receipt numbers, dates, and detailed categorization for accurate reporting.",
                      color: "accent",
                    },
                  ].map((card, index) => (
                    <div
                      key={card.title}
                      className="group bg-card rounded-xl p-6 border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: mounted ? "slideInUp 0.5s ease-out forwards" : "none",
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`p-3 bg-${card.color}/10 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                        >
                          <card.icon className={`w-6 h-6 text-${card.color}`} />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-card-foreground">{card.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Feature Content */}
            <div className="space-y-8 animate-in fade-in duration-700">
              {currentMode === "single" && <PayrollForm onGenerateReport={handleGenerateSingleReport} />}
              {currentMode === "contracts" && <ContractForms />}
              {currentMode === "inputData" && <InputDataTable />}
              {currentMode === "single" && singlePeriodData && (
                <div className="animate-in slide-in-from-bottom duration-500">
                  <PayrollReport
                    payrollData={singlePeriodData}
                    income={singlePeriodData.incomeAmount}
                    startDate={new Date(singlePeriodData.startDate)}
                    endDate={new Date(singlePeriodData.endDate)}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </InputDataProvider>
  )
}
"use client"

import type React from "react"
import { TrendingUp, AlertCircle, Download, FileText, File } from "lucide-react"
import PayrollTable from "./PayrollTable"
import { formatCurrency, formatDate } from "../utils/formatters"
import type { PayrollData } from "../types/payroll"

interface PayrollReportProps {
  payrollData: PayrollData
  income: number
  startDate: Date
  endDate: Date
}

const FULL_EXPENSE = 40400.0

const PayrollReport: React.FC<PayrollReportProps> = ({ payrollData, income, startDate, endDate }) => {
  const { data, totals, duration } = payrollData
  const netProfit = income - totals.overall

  const handleExportWord = async () => {
    try {
      // Dynamic import to avoid bundling issues
      const {
        Document,
        Packer,
        Paragraph,
        Table,
        TableRow,
        TableCell,
        TextRun,
        HeadingLevel,
        AlignmentType,
        WidthType,
        BorderStyle,
        ShadingType,
      } = await import("docx")

      const doc = new Document({
        creator: "Professional Payroll System",
        title: "Payroll Report",
        description: "Comprehensive payroll analysis and breakdown",
        styles: {
          paragraphStyles: [
            {
              id: "Heading1",
              name: "Heading 1",
              basedOn: "Normal",
              next: "Normal",
              quickFormat: true,
              run: {
                size: 32,
                bold: true,
                color: "1F2937",
              },
              paragraph: {
                spacing: { before: 400, after: 200 },
              },
            },
          ],
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440, // 1 inch
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PAYROLL REPORT",
                    bold: true,
                    size: 36,
                    color: "1E40AF",
                    font: "Calibri",
                  }),
                ],
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                shading: {
                  type: ShadingType.SOLID,
                  color: "F8FAFC",
                },
                border: {
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 3,
                    color: "3B82F6",
                  },
                },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Professional Payroll Analysis & Financial Summary",
                    size: 24,
                    color: "4F46E5",
                    font: "Calibri",
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "📅 PERIOD DETAILS",
                    bold: true,
                    size: 26,
                    color: "1F2937",
                    font: "Calibri",
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 300 },
                shading: {
                  type: ShadingType.SOLID,
                  color: "EFF6FF",
                },
                border: {
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 8,
                    color: "3B82F6",
                  },
                },
              }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
                  bottom: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
                  left: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
                  right: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "Start Date:", bold: true, size: 22, font: "Calibri" })],
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: "F9FAFB" },
                        width: { size: 40, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${formatDate(startDate)} E.C.`,
                                size: 22,
                                font: "Calibri",
                                color: "374151",
                              }),
                            ],
                          }),
                        ],
                        width: { size: 60, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "End Date:", bold: true, size: 22, font: "Calibri" })],
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: "F9FAFB" },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${formatDate(endDate)} E.C.`,
                                size: 22,
                                font: "Calibri",
                                color: "374151",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "Duration:", bold: true, size: 22, font: "Calibri" })],
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: "F9FAFB" },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${Math.round(duration)} Days`,
                                size: 22,
                                font: "Calibri",
                                color: "374151",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "💰 FINANCIAL SUMMARY",
                    bold: true,
                    size: 26,
                    color: "1F2937",
                    font: "Calibri",
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 600, after: 300 },
                shading: {
                  type: ShadingType.SOLID,
                  color: "F0FDF4",
                },
                border: {
                  left: {
                    style: BorderStyle.SINGLE,
                    size: 8,
                    color: "10B981",
                  },
                },
              }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 3, color: "10B981" },
                  bottom: { style: BorderStyle.SINGLE, size: 3, color: "10B981" },
                  left: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
                  right: { style: BorderStyle.SINGLE, size: 2, color: "E5E7EB" },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "F3F4F6" },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "Total Income", bold: true, size: 24, font: "Calibri" })],
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: "ECFDF5" },
                        width: { size: 60, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: formatCurrency(income),
                                color: "059669",
                                bold: true,
                                size: 26,
                                font: "Calibri",
                              }),
                            ],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: "F0FDF4" },
                        width: { size: 40, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "Total Expense", bold: true, size: 24, font: "Calibri" })],
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: "FEF2F2" },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: formatCurrency(totals.overall),
                                color: "DC2626",
                                bold: true,
                                size: 26,
                                font: "Calibri",
                              }),
                            ],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: "FEF2F2" },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "NET PROFIT", bold: true, size: 28, font: "Calibri" })],
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: netProfit >= 0 ? "DBEAFE" : "FEE2E2" },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: formatCurrency(netProfit),
                                bold: true,
                                size: 30,
                                color: netProfit >= 0 ? "059669" : "DC2626",
                                font: "Calibri",
                              }),
                            ],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                        shading: { type: ShadingType.SOLID, color: netProfit >= 0 ? "DBEAFE" : "FEE2E2" },
                      }),
                    ],
                  }),
                ],
              }),

              // Important Notes (if applicable)
              ...(totals.overall < FULL_EXPENSE
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "IMPORTANT NOTE ON TOTALS",
                          bold: true,
                          size: 20,
                          color: "D97706",
                        }),
                      ],
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 400, after: 200 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Because the work period is shorter than 30 days, not all expenses can be fully realized.",
                          size: 20,
                          color: "92400E",
                        }),
                      ],
                      spacing: { after: 200 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Original Full Expense: ${formatCurrency(FULL_EXPENSE)}`,
                          size: 20,
                          bold: true,
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Expense for this Period: ${formatCurrency(totals.overall)}`,
                          size: 20,
                          bold: true,
                        }),
                      ],
                      spacing: { after: 300 },
                    }),
                  ]
                : []),

              // Detailed Payroll Breakdown Header
              new Paragraph({
                children: [
                  new TextRun({
                    text: "DETAILED PAYROLL BREAKDOWN",
                    bold: true,
                    size: 24,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 300 },
              }),

              // GM Payroll Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "General Manager Payroll",
                    bold: true,
                    size: 20,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),

              // GM Table
              ...(data.gm.length > 0
                ? [
                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                      },
                      rows: [
                        // Header row
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Payment Date (E.C.)", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Description", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ children: [new TextRun({ text: "Rate", bold: true, size: 18 })] }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ children: [new TextRun({ text: "Days", bold: true, size: 18 })] }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Total Payment", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                          ],
                        }),
                        // Data rows
                        ...data.gm.map(
                          (item) =>
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.paymentDate, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.description, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [new Paragraph({ children: [new TextRun({ text: item.rate, size: 18 })] })],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [new TextRun({ text: item.days?.toString() || "", size: 18 })],
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({ text: formatCurrency(item.total), size: 18, bold: true }),
                                      ],
                                      alignment: AlignmentType.RIGHT,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ),
                      ],
                    }),
                  ]
                : []),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `GM Total: ${formatCurrency(totals.gm)}`,
                    bold: true,
                    size: 22,
                    color: "059669",
                  }),
                ],
                spacing: { before: 200, after: 300 },
                alignment: AlignmentType.RIGHT,
              }),

              // Laborer 1 Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Laborer 1 Payroll",
                    bold: true,
                    size: 20,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),

              // Laborer 1 Table
              ...(data.laborer1.length > 0
                ? [
                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                      },
                      rows: [
                        // Header row
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Work Week (E.C.)", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Payment Date (E.C.)", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Description", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ children: [new TextRun({ text: "Rate", bold: true, size: 18 })] }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ children: [new TextRun({ text: "Days", bold: true, size: 18 })] }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Total Payment", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                          ],
                        }),
                        // Data rows
                        ...data.laborer1.map(
                          (item) =>
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.workWeek || "", size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.paymentDate, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.description, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [new Paragraph({ children: [new TextRun({ text: item.rate, size: 18 })] })],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [new TextRun({ text: item.days?.toString() || "", size: 18 })],
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({ text: formatCurrency(item.total), size: 18, bold: true }),
                                      ],
                                      alignment: AlignmentType.RIGHT,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ),
                      ],
                    }),
                  ]
                : []),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Laborer 1 Total: ${formatCurrency(totals.laborer1)}`,
                    bold: true,
                    size: 22,
                    color: "059669",
                  }),
                ],
                spacing: { before: 200, after: 300 },
                alignment: AlignmentType.RIGHT,
              }),

              // Laborer 2 Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Laborer 2 Payroll",
                    bold: true,
                    size: 20,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),

              // Laborer 2 Table
              ...(data.laborer2.length > 0
                ? [
                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                      },
                      rows: [
                        // Header row
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Work Week (E.C.)", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Payment Date (E.C.)", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Description", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ children: [new TextRun({ text: "Rate", bold: true, size: 18 })] }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ children: [new TextRun({ text: "Days", bold: true, size: 18 })] }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Total Payment", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                          ],
                        }),
                        // Data rows
                        ...data.laborer2.map(
                          (item) =>
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.workWeek || "", size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.paymentDate, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.description, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [new Paragraph({ children: [new TextRun({ text: item.rate, size: 18 })] })],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [new TextRun({ text: item.days?.toString() || "", size: 18 })],
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({ text: formatCurrency(item.total), size: 18, bold: true }),
                                      ],
                                      alignment: AlignmentType.RIGHT,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ),
                      ],
                    }),
                  ]
                : []),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Laborer 2 Total: ${formatCurrency(totals.laborer2)}`,
                    bold: true,
                    size: 22,
                    color: "059669",
                  }),
                ],
                spacing: { before: 200, after: 300 },
                alignment: AlignmentType.RIGHT,
              }),

              // Transport Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Transport Payroll",
                    bold: true,
                    size: 20,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),

              // Transport Table
              ...(data.transport.length > 0
                ? [
                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                      },
                      rows: [
                        // Header row
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Payment Date (E.C.)", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Description", bold: true, size: 18 })],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ children: [new TextRun({ text: "Rate", bold: true, size: 18 })] }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [new TextRun({ text: "Total Payment", bold: true, size: 18 })],
                                  alignment: AlignmentType.RIGHT,
                                }),
                              ],
                            }),
                          ],
                        }),
                        // Data rows
                        ...data.transport.map(
                          (item) =>
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.paymentDate, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({ children: [new TextRun({ text: item.description, size: 18 })] }),
                                  ],
                                }),
                                new TableCell({
                                  children: [new Paragraph({ children: [new TextRun({ text: item.rate, size: 18 })] })],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      children: [
                                        new TextRun({ text: formatCurrency(item.total), size: 18, bold: true }),
                                      ],
                                      alignment: AlignmentType.RIGHT,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ),
                      ],
                    }),
                  ]
                : []),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `Transport Total: ${formatCurrency(totals.transport)}`,
                    bold: true,
                    size: 22,
                    color: "059669",
                  }),
                ],
                spacing: { before: 200, after: 400 },
                alignment: AlignmentType.RIGHT,
              }),

              // Grand Total Summary
              new Paragraph({
                children: [
                  new TextRun({
                    text: "GRAND TOTAL SUMMARY",
                    bold: true,
                    size: 24,
                    color: "1F2937",
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 300 },
                alignment: AlignmentType.CENTER,
              }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 2 },
                  bottom: { style: BorderStyle.SINGLE, size: 2 },
                  left: { style: BorderStyle.SINGLE, size: 2 },
                  right: { style: BorderStyle.SINGLE, size: 2 },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                },
                rows: [
                  // Header row
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "Expense Category", bold: true, size: 20 })],
                          }),
                        ],
                        width: { size: 70, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "Total Amount", bold: true, size: 20 })],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                        width: { size: 30, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                  // Data rows
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({ children: [new TextRun({ text: "General Manager Total", size: 18 })] }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: formatCurrency(totals.gm), size: 18, bold: true })],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Laborer 1 Total", size: 18 })] })],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: formatCurrency(totals.laborer1), size: 18, bold: true })],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Laborer 2 Total", size: 18 })] })],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: formatCurrency(totals.laborer2), size: 18, bold: true })],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Transport Total", size: 18 })] })],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: formatCurrency(totals.transport), size: 18, bold: true })],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                      }),
                    ],
                  }),
                  // Grand total row
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: "GRAND TOTAL", bold: true, size: 22, color: "1F2937" })],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: formatCurrency(totals.overall),
                                bold: true,
                                size: 24,
                                color: "059669",
                              }),
                            ],
                            alignment: AlignmentType.RIGHT,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              // Document Footer
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Report generated on ${new Date().toLocaleDateString()} | Professional Payroll Management System`,
                    size: 18,
                    color: "6B7280",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 600, after: 200 },
              }),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Payroll_Report_${formatDate(startDate)}_to_${formatDate(endDate)}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating Word document:", error)
      alert("Error generating Word document. Please try again.")
    }
  }

  const handleExportPDF = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default

      const element = document.getElementById("payroll-report-content")
      if (!element) return

      const opt = {
        margin: [0.75, 0.5, 0.75, 0.5],
        filename: `Professional_Payroll_Report_${formatDate(startDate)}_to_${formatDate(endDate)}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      }

      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  return (
    <div className="space-y-8">
      {/* Export Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Export Payroll Report
            </h2>
            <p className="text-gray-600 text-sm">Download your professional payroll report in your preferred format</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportWord}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              <File className="w-4 h-4" />
              Export as Word
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Content - Styled like a Word Document */}
      <div id="payroll-report-content" className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden">
        {/* Document Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">PAYROLL REPORT</h1>
          <p className="text-blue-100 text-lg">Professional Payroll Analysis & Summary</p>
        </div>

        {/* Document Body */}
        <div className="p-8 space-y-8" style={{ fontFamily: "Times New Roman, serif" }}>
          {/* Period Information Section */}
          <div className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Period Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <span className="font-semibold text-gray-900">{formatDate(startDate)} E.C.</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">End Date:</span>
                  <span className="font-semibold text-gray-900">{formatDate(endDate)} E.C.</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Total Duration:</span>
                  <span className="font-semibold text-gray-900">{Math.round(duration)} Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary Section */}
          <div className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Financial Summary</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid gap-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-lg font-medium text-gray-700">Total Income:</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(income)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-lg font-medium text-gray-700">Total Expense:</span>
                  <span className="text-xl font-bold text-red-600">{formatCurrency(totals.overall)}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-white rounded-lg px-4 shadow-sm">
                  <span className="text-xl font-bold text-gray-900">Net Profit:</span>
                  <span
                    className={`text-2xl font-bold flex items-center gap-2 ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="w-6 h-6" />
                    {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          {totals.overall < FULL_EXPENSE && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Important Note on Totals</h3>
                  <p className="text-amber-800 mb-4 leading-relaxed">
                    Because the work period is shorter than 30 days, not all expenses can be fully realized.
                  </p>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-amber-700">Original Full Expense:</span>
                      <span className="font-bold text-amber-900">{formatCurrency(FULL_EXPENSE)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-amber-700">Expense for this Period:</span>
                      <span className="font-bold text-amber-900">{formatCurrency(totals.overall)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payroll Tables Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-l-4 border-indigo-500 pl-6">
              Detailed Payroll Breakdown
            </h2>

            <PayrollTable
              title="General Manager Payroll"
              data={data.gm}
              total={totals.gm}
              headers={["Payment Date (E.C.)", "Description", "Rate", "Days", "Total Payment"]}
              renderRow={(item) => [
                item.paymentDate,
                item.description,
                item.rate,
                item.days?.toString() || "",
                formatCurrency(item.total),
              ]}
            />

            <PayrollTable
              title="Laborer 1 Payroll"
              data={data.laborer1}
              total={totals.laborer1}
              headers={["Work Week (E.C.)", "Payment Date (E.C.)", "Description", "Rate", "Days", "Total Payment"]}
              renderRow={(item) => [
                item.workWeek || "",
                item.paymentDate,
                item.description,
                item.rate,
                item.days?.toString() || "",
                formatCurrency(item.total),
              ]}
            />

            <PayrollTable
              title="Laborer 2 Payroll"
              data={data.laborer2}
              total={totals.laborer2}
              headers={["Work Week (E.C.)", "Payment Date (E.C.)", "Description", "Rate", "Days", "Total Payment"]}
              renderRow={(item) => [
                item.workWeek || "",
                item.paymentDate,
                item.description,
                item.rate,
                item.days?.toString() || "",
                formatCurrency(item.total),
              ]}
            />

            <PayrollTable
              title="Transport Payroll"
              data={data.transport}
              total={totals.transport}
              headers={["Payment Date (E.C.)", "Description", "Rate", "Total Payment"]}
              renderRow={(item) => [item.paymentDate, item.description, item.rate, formatCurrency(item.total)]}
            />
          </div>

          {/* Grand Total Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wide">
              Grand Total Summary
            </h3>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Expense Category
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">General Manager Total</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                      {formatCurrency(totals.gm)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Laborer 1 Total</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                      {formatCurrency(totals.laborer1)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Laborer 2 Total</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                      {formatCurrency(totals.laborer2)}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Transport Total</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                      {formatCurrency(totals.transport)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-green-50">
                  <tr>
                    <td className="px-6 py-6 text-lg font-bold text-gray-900 uppercase">Grand Total</td>
                    <td className="px-6 py-6 text-xl font-bold text-right text-green-700">
                      {formatCurrency(totals.overall)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Document Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Report generated on {new Date().toLocaleDateString()} | Professional Payroll Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayrollReport

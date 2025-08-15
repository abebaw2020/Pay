export interface EthiopianMonth {
  name: string
  amharic: string
  days: number
}

export const ETHIOPIAN_MONTHS: EthiopianMonth[] = [
  { name: "Meskerem", amharic: "መስከረም", days: 30 },
  { name: "Tikimt", amharic: "ጥቅምት", days: 30 },
  { name: "Hidar", amharic: "ኅዳር", days: 30 },
  { name: "Tahsas", amharic: "ታኅሳስ", days: 30 },
  { name: "Tir", amharic: "ጥር", days: 30 },
  { name: "Yekatit", amharic: "የካቲት", days: 30 },
  { name: "Megabit", amharic: "መጋቢት", days: 30 },
  { name: "Miazia", amharic: "ሚያዝያ", days: 30 },
  { name: "Ginbot", amharic: "ግንቦት", days: 30 },
  { name: "Sene", amharic: "ሰኔ", days: 30 },
  { name: "Hamle", amharic: "ሐምሌ", days: 30 },
  { name: "Nehase", amharic: "ነሐሴ", days: 30 },
  { name: "Pagume", amharic: "ጳጉሜ", days: 5 },
]

export const ethiopianMonths = ETHIOPIAN_MONTHS.map((month, index) => ({
  name: month.amharic,
  number: index + 1,
  days: month.days,
}))

export const getEthiopianMonthFromDate = (dateString: string): EthiopianMonth | null => {
  // Simple mapping based on Gregorian month to Ethiopian month
  // This is a simplified conversion for demonstration
  const date = new Date(dateString)
  const month = date.getMonth() + 1 // 1-12

  // Rough mapping (Ethiopian calendar is about 7-8 years behind)
  const ethiopianMonthIndex = month <= 9 ? month + 3 : month - 9
  return ETHIOPIAN_MONTHS[ethiopianMonthIndex - 1] || null
}

export const generateFullMonthRange = (year: number, month: number): { start: string; end: string } => {
  // Convert Ethiopian calendar month to approximate Gregorian dates
  // Ethiopian months roughly map to Gregorian months with offset

  let gregorianYear: number
  let gregorianMonth: number

  // Ethiopian calendar is about 7-8 years ahead in numbering
  // Ethiopian New Year starts around September 11th

  if (month <= 4) {
    // Months 1-4 (መስከረም to ታኅሳስ) map to Sept-Dec of Gregorian year
    gregorianYear = year + 7
    gregorianMonth = month + 8 // መስከረም(1)->Sept(9), ጥቅምት(2)->Oct(10), etc.
  } else {
    // Months 5-12 (ጥር to ነሐሴ) map to Jan-Aug of next Gregorian year
    gregorianYear = year + 8
    gregorianMonth = month - 4 // ጥር(5)->Jan(1), የካቲት(6)->Feb(2), etc.
  }

  // Get the number of days in the Gregorian month
  const daysInMonth = new Date(gregorianYear, gregorianMonth, 0).getDate()

  const startDate = `${gregorianYear}-${gregorianMonth.toString().padStart(2, "0")}-01`
  const endDate = `${gregorianYear}-${gregorianMonth.toString().padStart(2, "0")}-${daysInMonth.toString().padStart(2, "0")}`

  return { start: startDate, end: endDate }
}

export const formatEthiopianDate = (input: string | { year: number; month: number; day: number }): string => {
  if (typeof input === "string") {
    const [year, month, day] = input.split("-")
    return `${day}/${month}/${year}`
  } else {
    const { year, month, day } = input
    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year} E.C.`
  }
}

export const gregorianToEthiopian = (gregorianDate: Date) => {
  const year = gregorianDate.getFullYear()
  const month = gregorianDate.getMonth() + 1 // 1-12
  const day = gregorianDate.getDate()

  // Ethiopian New Year starts around September 11th
  // Ethiopian calendar is about 7-8 years behind Gregorian
  let ethiopianYear: number
  let ethiopianMonth: number
  let ethiopianDay: number

  // Determine if we're before or after Ethiopian New Year (Sept 11)
  if (month < 9 || (month === 9 && day < 11)) {
    // Before Ethiopian New Year - still in previous Ethiopian year
    ethiopianYear = year - 8
  } else {
    // After Ethiopian New Year - in current Ethiopian year
    ethiopianYear = year - 7
  }

  // Calculate Ethiopian month and day
  if (month >= 9) {
    // September to December
    if (month === 9 && day >= 11) {
      ethiopianMonth = 1 // Meskerem
      ethiopianDay = day - 10
    } else if (month === 9) {
      ethiopianMonth = 13 // Pagume (previous year)
      ethiopianDay = day + 20 // Approximate
      ethiopianYear = year - 8
    } else if (month === 10) {
      ethiopianMonth = 2 // Tikimt
      ethiopianDay = day + 20 > 30 ? day - 10 : day + 20
    } else if (month === 11) {
      ethiopianMonth = 3 // Hidar
      ethiopianDay = day + 20 > 30 ? day - 10 : day + 20
    } else if (month === 12) {
      ethiopianMonth = 4 // Tahsas
      ethiopianDay = day + 20 > 30 ? day - 10 : day + 20
    }
  } else {
    // January to August
    ethiopianMonth = month + 4
    if (ethiopianMonth > 12) {
      ethiopianMonth = ethiopianMonth - 12
    }
    ethiopianDay = day + 20 > 30 ? day - 10 : day + 20
  }

  // Ensure day is within valid range
  if (ethiopianDay <= 0) {
    ethiopianDay = 30 + ethiopianDay
    ethiopianMonth = ethiopianMonth - 1
    if (ethiopianMonth <= 0) {
      ethiopianMonth = 12
      ethiopianYear = ethiopianYear - 1
    }
  }
  if (ethiopianDay > 30 && ethiopianMonth <= 12) {
    ethiopianDay = ethiopianDay - 30
    ethiopianMonth = ethiopianMonth + 1
    if (ethiopianMonth > 12) {
      ethiopianMonth = 1
      ethiopianYear = ethiopianYear + 1
    }
  }

  return {
    year: ethiopianYear,
    month: ethiopianMonth,
    day: ethiopianDay,
  }
}

export const ethiopianToGregorian = (ethiopianYear: number, ethiopianMonth: number, ethiopianDay: number): Date => {
  // Ethiopian calendar is about 7-8 years behind Gregorian
  // Ethiopian New Year starts around September 11th

  let gregorianYear: number
  let gregorianMonth: number
  let gregorianDay: number

  // Convert Ethiopian year to Gregorian year
  if (ethiopianMonth <= 4) {
    // Months 1-4 (መስከረም to ታኅሳስ) map to Sept-Dec of Gregorian year
    gregorianYear = ethiopianYear + 7
    gregorianMonth = ethiopianMonth + 8 // መስከረም(1)->Sept(9), ጥቅምት(2)->Oct(10), etc.
  } else {
    // Months 5-12 (ጥር to ነሐሴ) map to Jan-Aug of next Gregorian year
    gregorianYear = ethiopianYear + 8
    gregorianMonth = ethiopianMonth - 4 // ጥር(5)->Jan(1), የካቲት(6)->Feb(2), etc.
  }

  // Adjust day calculation
  if (ethiopianMonth === 1) {
    // Meskerem starts around September 11th
    gregorianDay = ethiopianDay + 10
  } else {
    // Other months have approximate 20-day offset
    gregorianDay = ethiopianDay - 20 > 0 ? ethiopianDay - 20 : ethiopianDay + 10
  }

  // Ensure day is within valid range for the Gregorian month
  const daysInGregorianMonth = new Date(gregorianYear, gregorianMonth, 0).getDate()
  if (gregorianDay > daysInGregorianMonth) {
    gregorianDay = gregorianDay - daysInGregorianMonth
    gregorianMonth = gregorianMonth + 1
    if (gregorianMonth > 12) {
      gregorianMonth = 1
      gregorianYear = gregorianYear + 1
    }
  }
  if (gregorianDay <= 0) {
    gregorianMonth = gregorianMonth - 1
    if (gregorianMonth <= 0) {
      gregorianMonth = 12
      gregorianYear = gregorianYear - 1
    }
    const daysInPrevMonth = new Date(gregorianYear, gregorianMonth, 0).getDate()
    gregorianDay = daysInPrevMonth + gregorianDay
  }

  return new Date(gregorianYear, gregorianMonth - 1, gregorianDay)
}

export const getCurrentEthiopianDate = () => {
  const now = new Date()
  const ethiopian = gregorianToEthiopian(now)

  return {
    year: ethiopian.year,
    month: ethiopian.month,
    day: ethiopian.day,
    formatted: `${ethiopian.day.toString().padStart(2, "0")}/${ethiopian.month.toString().padStart(2, "0")}/${ethiopian.year}`,
  }
}

export const getCurrentGregorianDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()

  return {
    year,
    month,
    day,
    formatted: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
  }
}

export const getEthiopianMonthName = (monthNumber: number): string => {
  // monthNumber is 1-based (1-13)
  if (monthNumber < 1 || monthNumber > 13) {
    return "Unknown"
  }

  const month = ETHIOPIAN_MONTHS[monthNumber - 1]
  return month ? month.amharic : "Unknown"
}

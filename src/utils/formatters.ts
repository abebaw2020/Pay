export const formatCurrency = (num: number): string => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-CA")
}

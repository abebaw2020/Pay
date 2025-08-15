export const usePrintContract = () => {
  const printContract = (contractId: string) => {
    const contractElement = document.getElementById(contractId)
    if (!contractElement) return

    // Hide all other elements
    const allContracts = document.querySelectorAll(".contract-page")
    allContracts.forEach((contract) => {
      if (contract.id !== contractId) {
        ;(contract as HTMLElement).style.display = "none"
      }
    })

    const allButtons = document.querySelectorAll(".no-print")
    allButtons.forEach((button) => {
      ;(button as HTMLElement).style.display = "none"
    })

    window.print()

    // Restore visibility
    allContracts.forEach((contract) => {
      ;(contract as HTMLElement).style.display = "flex"
    })
    allButtons.forEach((button) => {
      ;(button as HTMLElement).style.display = "block"
    })
  }

  return { printContract }
}

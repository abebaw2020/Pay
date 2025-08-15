export interface ContractFormData {
  id: string
  type: "rental" | "debt"
  createdDate: string
  formData: RentalContractData | DebtContractData
}

export interface RentalContractData {
  landlord: string
  tenant: string
  address: string
  houseNumber: string
  propertyType: string
  rentAmount: string
  paymentDate: string
  additionalAgreements: string
  landlordSignature: {
    name: string
    signature: string
    date: string
  }
  tenantSignature: {
    name: string
    signature: string
    date: string
  }
  witnesses: string[]
}

export interface DebtContractData {
  creditor: {
    name: string
    address: string
    employeeId: string
  }
  debtor: {
    name: string
    address: string
    kebele: string
  }
  agreementContent: string
  paymentByDebtor: string
  paymentMethod: string
  startDate: string
  endDate: string
  contractPeriod: {
    startDate: string
    endDate: string
  }
  signatures: {
    creditor: { name: string; signature: string }
    debtor: { name: string; signature: string }
    guarantor: { name: string; signature: string }
  }
  witnesses: string[]
}

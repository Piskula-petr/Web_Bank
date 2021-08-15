export interface NewPayment {
    userID: number,
    name: string,
    mark: string,
    amount: string,
    currency: string,
    variableSymbol: string,
    constantSymbol: string,
    specificSymbol: string,
    paymentDate: Date,
    paymentType: string,
    accountNumber: string,
    [key: string]: string | number | Date
}
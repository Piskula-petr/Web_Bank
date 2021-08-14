export interface NewPayment {
    userID: number,
    name: string,
    mark: string,
    accountNumber: string,
    amount: string,
    currency: string,
    variableSymbol: string,
    constantSymbol: string,
    specificSymbol: string,
    paymentDate: Date,
    paymentType: string,
    [key: string]: string | number | Date
}
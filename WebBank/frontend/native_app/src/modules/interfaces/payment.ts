export interface Payment {
    id: number,
    userID: number,
    name: string,
    mark: string,
    amount: number,
    currency: string,
    variableSymbol: number,
    constantSymbol: number,
    specificSymbol: number,
    paymentDate: Date,
    paymentType: string,
    accountNumber: string,
}
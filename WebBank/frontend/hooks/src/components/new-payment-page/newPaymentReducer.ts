import { NewPayment } from 'modules/interfaces/newPayment';
import { NewPaymentErrors } from 'modules/interfaces/newPaymentErrors';

/**
 * Reducer state
 */
export interface NewPaymentReducerState {
    newPayment: NewPayment,
    newPaymentErrors: NewPaymentErrors,
    accountNumberPrefixInput: string,
    bankCode: string | null,
    amountInput: string,
    exchangeRateToCZK: number,
    inputConfirmationCode: string,
    generatedConfirmationCode: number
}


/**
 * Reducer Action
 */
export type NewPaymentReducerAction = 
    SetChange | 
    SetAccountNumberPrefix | 
    SetBankCode | 
    SetAmount | 
    SetExchangeRate | 
    SetConfirmation | 
    FetchError;

interface SetChange {
    type: "SET_CHANGE",
    payload: {
        newPayment: NewPayment
    }
}

interface SetAccountNumberPrefix {
    type: "SET_ACCOUNT_NUMBER_PREFIX",
    payload: string
}

interface SetBankCode {
    type: "SET_BANK_CODE",
    payload: string | null
}

interface SetAmount {
    type: "SET_AMOUNT",
    payload: string
}

interface SetExchangeRate {
    type: "SET_EXCHANGE_RATE",
    payload: number
}

interface SetConfirmation {
    type: "SET_CONFIRMATION",
    payload: string
}

interface FetchError {
    type: "FETCH_ERROR",
    payload: NewPaymentReducerState
}
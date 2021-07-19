import { CHANGE_CURRENCY } from "redux/currency/currencyTypes";

export const changeCurrency = (currency) => {

    return {
        type: CHANGE_CURRENCY,
        payload: currency
    }
}
import { Currency } from "redux/currency/currency";
import { CurrencyTypes } from "redux/currency/currencyTypes";

export const changeCurrency = (currency: Currency) => {

    return {
        type: CurrencyTypes.CHANGE_CURRENCY,
        payload: currency
    }
}
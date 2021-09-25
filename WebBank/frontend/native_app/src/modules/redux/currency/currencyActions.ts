import { Currency } from "modules/redux/currency/currency";
import { CurrencyTypes } from "modules/redux/currency/currencyTypes";

export const changeCurrency = (currency: Currency) => {

    return {
        type: CurrencyTypes.CHANGE_CURRENCY,
        payload: currency
    }
}
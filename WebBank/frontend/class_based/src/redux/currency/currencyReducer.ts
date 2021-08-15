import { CurrencyTypes } from "redux/currency/currencyTypes";
import { Currency } from 'redux/currency/currency';

const initialState = {
    exchangeRate: 1,
    name: "CZK"
}

interface Action {
    type: string,
    payload: Currency
}

const currencyReducer = (state = initialState, action: Action) => {

    switch (action.type) {

        case CurrencyTypes.CHANGE_CURRENCY:

            return {
                ...state,
                exchangeRate: action.payload.exchangeRate,
                name: action.payload.name
            }

        default: return state
    }
}

export default currencyReducer;
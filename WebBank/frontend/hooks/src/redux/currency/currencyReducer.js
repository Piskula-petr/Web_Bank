import { CHANGE_CURRENCY } from "redux/currency/currencyTypes";

const initialState = {
    exchangeRate: 1,
    name: "CZK"
}

const currencyReducer = (state = initialState, action) => {

    switch (action.type) {

        case CHANGE_CURRENCY:

            return {
                ...state,
                exchangeRate: action.payload.exchangeRate,
                name: action.payload.name
            }

        default: return state
    }
}

export default currencyReducer
import { combineReducers } from "redux";
import userReducer from "modules/redux/user/userReducer";
import currencyReducer from "modules/redux/currency/currencyReducer"

const rootReducer = combineReducers({
    user: userReducer,
    currency: currencyReducer
})

export default rootReducer;

export type State = ReturnType<typeof rootReducer>
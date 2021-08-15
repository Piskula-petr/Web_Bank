import { combineReducers } from "redux";
import userReducer from "redux/user/userReducer";
import currencyReducer from "redux/currency/currencyReducer"

const rootReducer = combineReducers({
    user: userReducer,
    currency: currencyReducer
})

export default rootReducer;

export type State = ReturnType<typeof rootReducer>
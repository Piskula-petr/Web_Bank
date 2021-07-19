import { combineReducers } from "redux";
import userReducer from "redux/user/userReducer";

const rootReducer = combineReducers({
    user: userReducer,
})

export default rootReducer;
import { SET_USER_ID } from "redux/user/userTypes";

const initialState = {
    userID: 0
}

const userReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_USER_ID: 

            return {
                ...state,
                userID: action.payload
            }
        
        default: return state
    }
}

export default userReducer
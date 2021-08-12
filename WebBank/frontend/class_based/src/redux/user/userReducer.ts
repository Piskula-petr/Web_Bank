import { UserTypes } from "redux/user/userTypes";

const initialState = {
    userID: 0
}

interface Action {
    type: string,
    payload: number
}

const userReducer = (state = initialState, action: Action) => {

    switch (action.type) {

        case UserTypes.SET_USER_ID: 

            return {
                ...state,
                userID: action.payload
            }
        
        default: return state
    }
}

export default userReducer
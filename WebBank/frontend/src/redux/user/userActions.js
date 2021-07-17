import { SET_USER_ID } from "redux/user/userTypes";

export const setUserID = (userID) => {
    
    return {
        type: SET_USER_ID,
        payload: userID
    }
}
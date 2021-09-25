import { UserTypes } from "modules/redux/user/userTypes";

export const setUserID = (userID: number) => {

    return {
        type: UserTypes.SET_USER_ID,
        payload: userID
    }
}
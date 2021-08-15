/**
 * Reducer state
 */
export interface LoginReducerState {
    clientNumber: string,
    password: string,
    clientNumberError: string,
    passwordError: string,
    [key: string]: string
};


/**
 * Reducer action
 */
export type LoginReducerAction =  SetChangeAction | FetchEroorAction;

interface SetChangeAction {
    type: "SET_CHANGE",
    payload: LoginReducerState
}

interface FetchEroorAction {
    type: "FETCH_ERROR",
    payload: {
        clientNumberError: string,
        passwordError: string
    }
}
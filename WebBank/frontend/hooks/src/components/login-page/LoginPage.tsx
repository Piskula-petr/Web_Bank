import React, { useState, useEffect, useReducer, ChangeEvent } from 'react'
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Dispatch } from "redux";

import styles from "components/login-page/login-page.module.css";
import logo from "images/logo.png";
import { setUserID } from 'redux/user/userActions'
import { LoginReducerState, LoginReducerAction } from "components/login-page/loginReducer";

interface LoginPageProps {
    setUserID: (userID: number) => void
}

const LoginPage: React.FC<LoginPageProps> = (props) => {


    // Úspěšné přihlášení
    const [ successLogin, setSuccessLogin ] = useState<boolean>(false);


    // Výchozí přihlašovací data
    const initialLoginData = {

        // Přihlašovací údaje
        clientNumber: "",
        password: "",

        // Chybové zprávy
        clientNumberError: "",
        passwordError: ""
    }
     

    // Reducer
    const [ state, dispatch ] = useReducer((state: LoginReducerState, action: LoginReducerAction): LoginReducerState => {

        switch (action.type) {

            case "SET_CHANGE":

                return action.payload
            
            case "FETCH_ERROR":

                return {
                    ...state,
                    clientNumberError: action.payload.clientNumberError,
                    passwordError: action.payload.passwordError
                }
        }

    }, initialLoginData)


    /**
     * Inicializace komponenty
     */
    useEffect(() => {

        // Změna názvu stránky
        document.title = "Přihlášení | Web Bank"

    }, [])


    /**
     * Změna přihlašovacích údajů
     * 
     * @param event 
     */
    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {

        const validValue = (event.target.validity.valid 
            ? event.target.value 
                : state[event.target.name]);

        dispatch({
            type: "SET_CHANGE", 
            payload: {
                ...state,
                [event.target.name]: validValue
            }
        })
    }


    /**
     * Odeslání formuláře 
     * 
     * @param event 
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {

        event.preventDefault();

        const { clientNumber, password } = state;

        // Request - přihlášení uživatele
        axios.post("http://localhost:8080/api/login", {

            clientNumber,
            password

        }).then(({ data: {token, expireTime, userID} }) => {

            const jwt = {
                token,
                expireTime
            }

            // Vytvoření cookies
            Cookies.set("jwt", jwt, {expires: new Date(expireTime), secure: true});

            // Nastavení ID uživatele (redux)
            props.setUserID(userID);

            setSuccessLogin(true);

        }).catch(({ response: {data} }) => {

            let errorMessage: string = data.clientNumber;

            // Chybová hláška při nesprávných přihlašovacích údajích
            if (data.clientNumber === undefined && data.password === undefined) {

                errorMessage = "Přihlašovací údaje jsou nesprávné";
            }

            dispatch({
                type: "FETCH_ERROR",
                payload: {
                    clientNumberError: errorMessage,
                    passwordError: data.password as string
                }
            })
        })
    }

    
    // Přesměrování na stránku přehledu
    if (successLogin) {
        
        return <Redirect to="/prehled" />
    }



    /**
     * Vykreslení
     */
    return (
        <form className={styles.formLogin} onSubmit={handleSubmit}>

            {/* Logo */}
            <img className={styles.logo} src={logo} alt="Logo"/>

            {/* Klientské číslo */}
            <div className={styles.clientNumberContainer}>

                <label htmlFor="clientNumber">Klientské číslo: </label>

                <div>
                    <div className={styles.errorMessage}>
                        {state.clientNumberError}
                    </div>

                    <input pattern="[0-9]{0,10}" id="clientNumber" name="clientNumber" 
                        value={state.clientNumber} autoFocus onChange={handleChange} />
                </div>
            </div>

            {/* Heslo */}
            <div className={styles.passwordContainer}>

                <label htmlFor="password">Heslo: </label>

                <div>
                    <div className={styles.errorMessage}>
                        {state.passwordError}
                    </div>

                    <input type="password" id="password" value={state.password}
                        name="password" onChange={handleChange} />
                </div>
            </div>

            {/* Submit */}
            <div className={styles.buttonContainer}>
                <button id="submit" type="submit">Pokračovat</button>
            </div>
        </form>
    )
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    
    return {
        setUserID: (userID: number) => dispatch(setUserID(userID))
    }
}

export default connect(null, mapDispatchToProps) (LoginPage)

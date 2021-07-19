import React, {useState, useEffect} from 'react'
import {Redirect} from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { setUserID } from 'redux/user/userActions'

import styles from "components/login-page/login-page.module.css";
import logo from "images/logo.png";

const LoginPage = (props) => {

    // Přihlašovací údaje
    const [loginData, setloginData] = useState({clientNumber: "", password: ""});

    // Chybové zprávy
    const [loginDataError, setloginDataError] = useState({clientNumberError: "", passwordError: ""})

    // Úspěšné přihlášení
    const [successLogin, setSuccessLogin] = useState(false);


    useEffect(() => {

        // Změna názvu stránky
        document.title = "Přihlášení | Web Bank"

    }, [])


    /**
     * Změna přihlašovacích údajů
     * 
     * @param event 
     */
    const handleChange = (event) => {

        setloginData({
            ...loginData,
            [event.target.name]: event.target.value
        })
    }


    /**
     * Odeslání formuláře 
     * 
     * @param event 
     */
    const handleSubmit = (event) => {

        event.preventDefault();

        const { clientNumber, password } = loginData;

        // Request - vrací uživatelské ID
        axios.post("http://localhost:8080/api/login", {

            clientNumber,
            password

        }).then(({ data: {token, epireTime, userID} }) => {

            const jwt = {
                token,
                epireTime
            }

            // Vytvoření cookies
            Cookies.set("jwt", jwt, {expires: new Date(epireTime), secure: true});

            // Nastavení ID uživatele (redux)
            props.setUserID(userID);

            setSuccessLogin(true);

        }).catch(({ response: {data} }) => {

            let errorMessage = data.clientNumber;

            // Chybová hláška při nesprávných přihlašovacích údajích
            if (data.clientNumber === undefined && data.password === undefined) {

                errorMessage = "Přihlašovací údaje jsou nesprávné";
            }

            // Nastavení chybových zpráv
            setloginDataError({
                ...loginDataError,
                clientNumberError: errorMessage,
                passwordError: data.password
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
                        {loginDataError.clientNumberError}
                    </div>

                    <input id="clientNumber" name="clientNumber" 
                        autoFocus="autoFocus" onChange={handleChange} />
                </div>
            </div>

            {/* Heslo */}
            <div className={styles.passwordContainer}>

                <label htmlFor="password">Heslo: </label>

                <div>
                    <div className={styles.errorMessage}>
                        {loginDataError.passwordError}
                    </div>

                    <input type="password" id="password" 
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

const mapDispatchToProps = (dispatch) => {
    
    return {
        setUserID: (userID) => dispatch(setUserID(userID))
    }
}

export default connect(null, mapDispatchToProps) (LoginPage)

import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import { setUserID } from "redux/user/userActions";

import styles from "components/login-page/login-page.module.css";
import logo from "images/logo.png";

class LoginForm extends Component {

    
    /**
     * Konstruktor
     * 
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {

            // Přihlašovací údaje
            clientNumber: "",
            password: "",

            // Chybové zprávy
            clientNumberError: "",
            passwordError: "",

            // Úspěšné přihlášení
            successLogin: false,
        }
    }


    /**
     * Změna názvu stránky
     */
    componentDidMount() {

        document.title = "Přihlášení | Web Bank"
    }


    /**
     * Změna přihlašovacích údajů
     * 
     * @param event 
     */
    handleChange = (event) => {

        const validValue = (event.target.validity.valid 
            ? event.target.value 
                : this.state[event.target.name]);

        this.setState({
            [event.target.name]: validValue
        });
    }


    /**
     * Odeslání formuláře 
     * 
     * @param event 
     */
    handleSubmit = (event) => {

        event.preventDefault();

        // Request - vrací uživatelské ID
        axios.post("http://localhost:8080/api/login", {

            clientNumber: this.state.clientNumber,
            password: this.state.password

        }).then(({ data: {token, expireTime, userID} }) => {

            const jwt = {
                token,
                expireTime
            };

            // Vytvoření cookies
            Cookies.set("jwt", jwt, {expires: new Date(expireTime), secure: true});

            // Nastavení ID uživatele (redux)
            this.props.setUserID(userID);

            this.setState({
                successLogin: true,
            });

        }).catch(({ response: { data } }) => {

            let errorMessage = data.clientNumber;

            // Chybová hláška při nesprávných přihlašovacích údajích
            if (data.clientNumber === undefined && data.password === undefined) {
                
                errorMessage = "Přihlašovací údaje jsou nesprávné";
            }

            // Nastavení chybových zpráv
            this.setState({
                clientNumberError: errorMessage,
                passwordError: data.password,
            });
        });
    }


    /**
     * Vykreslení
     */
    render() {

        // Přesměrování na stránku přehledu
        if (this.state.successLogin) {
            return <Redirect to="/prehled" />
        }

        return (
            <form className={styles.formLogin} onSubmit={this.handleSubmit}>

                {/* Logo */}
                <img className={styles.logo} src={logo} alt="Logo"/>

                {/* Klientské číslo */}
                <div className={styles.clientNumberContainer}>

                    <label htmlFor="clientNumber">Klientské číslo: </label>

                    <div>
                        <div className={styles.errorMessage}>
                            {this.state.clientNumberError}
                        </div>

                        <input pattern="[0-9]{0,10}" id="clientNumber" name="clientNumber" 
                            autoFocus="autoFocus" onChange={this.handleChange} value={this.state.clientNumber} />
                    </div>
                </div>

                {/* Heslo */}
                <div className={styles.passwordContainer}>

                    <label htmlFor="password">Heslo: </label>

                    <div>
                        <div className={styles.errorMessage}>
                            {this.state.passwordError}
                        </div>

                        <input type="password" id="password" name="password" 
                            onChange={this.handleChange} value={this.state.password} />
                    </div>
                </div>

                {/* Submit */}
                <div className={styles.buttonContainer}>
                    <button id="submit" type="submit">Pokračovat</button>
                </div>
            </form>
        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        setUserID: (userID) => dispatch(setUserID(userID))
    }
}

export default connect(null, mapDispatchToProps) (LoginForm)
import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import "./loginPage.css";
import logo from "../../images/logo.png";

export default class LoginForm extends Component {

    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props)

        this.state = {

            // Přihlašovací údaje
            clientNumber: "",
            password: "",

            // Chybové zprávy
            clientNumberError: "",
            passwordError: "",

            // ID uživatele
            userID: 0,

            // Úspěšné přihlášení
            successLogin: false,
        }
    }


    /**
     * Změna přihlašovacích údajů
     * 
     * @param event 
     */
    handleChange = (event) => {

        this.setState({
            [event.target.name]: event.target.value
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

        }).then(({data, status}) => {

            // Změna stavu ID uživatele
            if (status === 200) {

                this.props.setUser(data.userID);

                this.setState({
                    userID: data.userID,
                    successLogin: true,
                });

            } else {

                // Změna stavu chybových zpráv
                this.setState({
                    clientNumberError: data.clientNumber,
                    passwordError: data.password,
                });
            }
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
            <form onSubmit={this.handleSubmit}>

                {/* Logo */}
                <img src={logo} alt="Logo" />

                {/* Klientské číslo */}
                <div className="clientNumberContainer">

                    <label htmlFor="clientNumber">Klientské číslo: </label>

                    <div>
                        <div className="errorMessage">
                            {this.state.clientNumberError}
                        </div>

                        <input id="clientNumber" name="clientNumber" 
                            autoFocus="autoFocus" onChange={this.handleChange} />
                    </div>
                </div>

                {/* Heslo */}
                <div className="passwordContainer">

                    <label htmlFor="password">Heslo: </label>

                    <div>
                        <div className="errorMessage">
                            {this.state.passwordError}
                        </div>

                        <input type="password" id="password" 
                            name="password" onChange={this.handleChange} />
                    </div>
                </div>

                {/* Submit */}
                <div className="buttonContainer">
                    <button id="submit" type="submit">Pokračovat</button>
                </div>
            </form>
        )
    }
}
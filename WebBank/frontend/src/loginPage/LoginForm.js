import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import "../css/loginPage.css";

import logo from "../images/logo.png";

export default class LoginForm extends Component {

// Konstruktor ///////////////////////////////////////////////////////////////////////

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

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

// Změna stavu přihlašovacích údajů /////////////////////////////////////////////////

    handleChange(event) {

        this.setState({
            [event.target.name]: event.target.value
        });
    }

// Odeslání formuláře ////////////////////////////////////////////////////////////////

    handleSubmit(event) {
        event.preventDefault();

        // Request - vrací uživatelské ID
        fetch("http://localhost:8080/api/login", {

            method: "POST",
            headers: {"Content-Type": "application/json"},
            
            body: JSON.stringify({
                "clientNumber": this.state.clientNumber,
                "password": this.state.password,
            }),
            
        }).then(response => response.json().then(data => {

            // Změna stavu ID uživatele
            if (response.ok) {

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
        }));
    }

// Vykreslení ////////////////////////////////////////////////////////////////////////

    render() {

        // Přesměrování na stránku přehledu
        if (this.state.successLogin) {
            return <Redirect to="/prehled" />
        }
        
        return (
            <form id="loginForm" onSubmit={this.handleSubmit}>

                <img id="logo" src={logo} alt="Logo" />

                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="clientNumber">Klientské číslo: </label>
                            </td>

                            <td>
                                <div id="error">{this.state.clientNumberError}</div>

                                <input id="clientNumber" 
                                       name="clientNumber" 
                                       autoFocus="autoFocus" 
                                       onChange={this.handleChange} 
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label htmlFor="password">Heslo: </label>
                            </td>

                            <td>
                                <div id="error">{this.state.passwordError}</div>

                                <input type="password" 
                                       name="password" 
                                       id="password" 
                                       onChange={this.handleChange} 
                                />
                            </td>
                        </tr>
                        
                        <tr>
                            <td colSpan="2">
                                <button id="submit" type="submit">Pokračovat</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        )
    }
}
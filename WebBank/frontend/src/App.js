import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";

import "App.css";
import LoginForm from "./components/login-page/LoginForm";
import OverviewPage from "./components/overview-page/OverviewPage";
import NewPayment from "./components/new-payment/NewPayment";

export default class App extends Component {


  /**
   * Konstruktor
   * 
   * @param props
   */
    constructor(props) {
        super(props);

        this.state = {

            // ID přihlášeného uživatele
            userID: 0,
        }
    }


    /**
     * Nastavení ID uživatele
     * 
     * @param data 
     */
    setUserID = (data) => {

        this.setState({
            userID: data,
        });
    }


    /**
     * Vykreslení
     */
    render() {

        return (
            <Router>

                <Route path="/prihlaseni">

                    <LoginForm 
                        setUserID={this.setUserID} />

                </Route>

                <Route path="/prehled">

                    <OverviewPage 
                        setUserID={this.setUserID} 
                        userID={this.state.userID} />

                </Route>

                <Route path="/nova-platba">

                    <NewPayment 
                        userID={this.state.userID} />

                </Route>

                <Redirect from="/" to="/prihlaseni" />
                
            </Router>
        )
    }
}

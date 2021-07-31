import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";

import "App.css";
import LoginForm from "./components/login-page/LoginForm";
import OverviewPage from "./components/overview-page/OverviewPage";
import NewPayment from "./components/new-payment/NewPayment";

class App extends Component {

    
    /**
     * Vykreslení
     */
    render() {

        return (
            <Router>

                {/* Přihlašovací formulář */}
                <Route path="/prihlaseni">
                    <LoginForm />
                </Route>

                {/* Přehled plateb */}
                <Route path="/prehled">
                    <OverviewPage />
                </Route>

                {/* Nová platba */}
                <Route path="/nova-platba">
                    <NewPayment />
                </Route>

                <Redirect from="/" to="/prihlaseni" />
                
            </Router>
        )
    }
}

export default App
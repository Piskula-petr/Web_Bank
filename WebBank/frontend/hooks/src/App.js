import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";

import './App.css';
import LoginPage from "components/login-page/LoginPage";
import OverviewPage from "components/overview-page/OverviewPage";
// import NewPayment from "components/new-payment/NewPayment";

function App() {


    /**
     * Vykreslení
     */
    return (
        <Router>
            
            {/* Přihlašovací formulář */}
            <Route path="/prihlaseni">
                <LoginPage />
            </Route>

            {/* Přehled plateb */}
            <Route path="/prehled">
                <OverviewPage />
            </Route>

            {/* Nová platba */}
            {/* <Route path="/nova-platba">
                <NewPayment />
            </Route> */}

            <Redirect from="/" to="/prihlaseni" />

        </Router>
    );
}

export default App;
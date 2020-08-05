import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";

// Komponenty
import LoginForm from "./loginPage/LoginForm";
import OverviewIndex from "./overviewPage/OverviewIndex";
import NewPayment from "./newPayment/NewPayment";

export default class App extends Component {

// Konstruktor ///////////////////////////////////////////////////////////////////////

  constructor(props) {
    super(props);

    this.state = {

      // ID přihlášeného uživatele
      userID: 0,
    }

    this.setUser = this.setUser.bind(this);
  }

// Změna stavu ID uživatele //////////////////////////////////////////////////////////

  setUser(data) {

    this.setState({
      userID: data,
    });
  }

// Vykreslení ////////////////////////////////////////////////////////////////////////

  render() {

    return (
      <Router>

        <Route path="/prihlaseni">
          <LoginForm setUser={this.setUser} />
        </Route>

        <Route path="/prehled">
          <OverviewIndex userID={this.state.userID} />
        </Route>

        <Route path="/nová-platba">
          <NewPayment userID={this.state.userID} />
        </Route>

        <Redirect from="/" to="/prihlaseni" />
        
      </Router>
    )
  }
}

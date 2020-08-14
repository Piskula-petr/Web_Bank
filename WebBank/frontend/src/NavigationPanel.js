import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./css/navigationPanel.css";
import logout from "./images/logout.png";

export default class NavigationPanel extends Component {

// Konstruktor ////////////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

// Odhlášení //////////////////////////////////////////////////////////////////////////

    logout() {

        this.props.setUser(0);
    }

// Vykreslení /////////////////////////////////////////////////////////////////////////

    render() {

        return(
            <div id="navigationContainer">

                <Link id="logout" to="/prihlaseni" onClick={this.logout}>
                    <img src={logout} alt="Logout" />
                    Odhlášení</Link>
                
            </div>
        )
    }
}
import React, {Component} from "react";
import {Link} from "react-router-dom";

import styles from "components/navigation-panel/navigation-panel.module.css";
import back from "images/back.png";
import logout from "images/logout.png";

export default class NavigationPanel extends Component {


    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props)
    
        this.state = {

            secondsLeft: this.props.timeInterval,
        }
    }


    /**
     * Nasazení componenty
     */
    componentDidMount() {
        
        // Přidání click eventu
        document.addEventListener("click", this.handleClick);

        // Spuštění intervalu (1s)
        this.interval = setInterval(() => {

            this.setState({
                secondsLeft: this.state.secondsLeft - 1, 
            });

            // Odhlášení, při uběhnutí odpočtu
            if (this.state.secondsLeft === 0) this.logout();

        }, 1000);
    }


    /**
     * Zastavení intervalu
     */
    componentWillUnmount() {
        
        clearInterval(this.interval);

        // Odebrání click eventu
        document.removeEventListener("click", this.handleClick);
    }


    /**
     * Resetování odpočtu
     */
    handleClick = (event) => {

        if (event.target.id !== "newPayment") {

            this.setState({
                secondsLeft: this.props.timeInterval
            });
        }
    }


    /**
     * Odhlášení
     */
    logout = () => {
        
        this.props.setUserID(0);
    }


    /**
     * Vykreslení
     */
    render() {

        const { secondsLeft } = this.state;

        let minutes = Math.floor((secondsLeft / 60) % 60);
        let seconds = Math.floor(secondsLeft % 60);

        let zero = (seconds < 10 ? "0" : "");

        return(
            <div className={styles.navigationContainer}>

                {/* Návrat na přehled */}
                <Link className={styles.back} to="/prehled">

                    <img className={`${styles.backLogo} ${(this.props.backLabel === undefined ? styles.hide : "")}`} src={back} alt="Back" /> 

                    <div>{this.props.backLabel}</div>

                </Link>

                {/* Odhlášení */}
                <Link className={styles.logout} to="/prihlaseni" onClick={this.logout}>

                    <img className={styles.logoutLogo} src={logout} alt="Logout" />

                    <div>Odhlášení za {minutes}:{zero}{seconds}</div>

                </Link>
            </div>
        )
    }
}
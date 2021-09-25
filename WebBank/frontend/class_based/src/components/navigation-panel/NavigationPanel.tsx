import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { connect } from "react-redux";
import { setUserID } from "redux/user/userActions";
import { Dispatch } from "redux";
import { Currency } from "redux/currency/currency";

import styles from "components/navigation-panel/navigation-panel.module.css";
import backLogo from "images/back.png";
import logoutLogo from "images/logout.png";
import { changeCurrency } from "redux/currency/currencyActions";

interface NavigationPanelProps {
    timeInterval: number,
    backLabel?: string,
    setUserID: (userID: number) => void,
    changeCurrency: (currency: Currency) => void
}

interface NavigationPanelState {
    secondsLeft: number,
    jwtExpireTime: Date,
}

class NavigationPanel extends Component <NavigationPanelProps, NavigationPanelState> {


    private interval: number | undefined;
    

    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props: NavigationPanelProps) {
        super(props)
    
        this.state = {

            // Zbývající vteřiny odpočtu
            secondsLeft: this.props.timeInterval,

            // Čas vypršení JWT
            jwtExpireTime: new Date(Cookies.getJSON("jwt").expireTime),
        }
    }


    /**
     * Nasazení componenty
     */
    componentDidMount(): void {

        // Přidání click eventu
        document.addEventListener("click", this.handleClick);

        // Spuštění intervalu (1s)
        this.interval = window.setInterval(() => {

            this.setState({
                secondsLeft: this.state.secondsLeft - 1, 
            });

            const TIME_BEFORE_EXPIRE: number = 30 * 1000;   // 30 sekund

            if (new Date().getTime() > (this.state.jwtExpireTime.getTime() - TIME_BEFORE_EXPIRE)) {

                // Request - obnovení JWT
                axios.get("http://localhost:8080/api/refresh", {

                    headers: {
                        Authorization: "Bearer " + Cookies.getJSON("jwt").token
                    }

                }).then(({data: { token, expireTime }}) => {

                    const jwt = {
                        token,
                        expireTime
                    }

                    // vytvoření nového cookies
                    Cookies.set("jwt", jwt, {expires: new Date(expireTime), secure: true});

                    this.setState({
                        jwtExpireTime: new Date(expireTime)
                    })

                }).catch((error) => console.log(error))
            }

            // Odhlášení, při uběhnutí odpočtu
            if (this.state.secondsLeft === 0) this.logout();

        }, 1000);
    }


    /**
     * Zastavení intervalu
     */
    componentWillUnmount(): void {
        
        clearInterval(this.interval);

        // Odebrání click eventu
        document.removeEventListener("click", this.handleClick);
    }


    /**
     * Resetování odpočtu
     */
    handleClick = (): void => {

        this.setState({
            secondsLeft: this.props.timeInterval
        });
    }


    /**
     * Odhlášení
     */
    logout = (): void => {
        
        // Odstranění cookies
        Cookies.remove("jwt");

        // Vynulování ID uživatele (redux)
        this.props.setUserID(0);

        // Nastavení výchozí měny (redux)
        this.props.changeCurrency({
            exchangeRate: 1,
            name: "CZK"
        })
    }


    /**
     * Vykreslení
     */
    render(): JSX.Element {

        // Přesměrování na přihlášení, po vypršení odpočtu
        if (this.state.secondsLeft === 0) {

            return <Redirect to="/prihlaseni" />
        }

        const { secondsLeft } = this.state;

        let minutes: number = Math.floor((secondsLeft / 60) % 60);
        let seconds: number = Math.floor(secondsLeft % 60);

        let zero: string = (seconds < 10 ? "0" : "");

        return(
            <div className={styles.navigationContainer}>

                {/* Návrat na přehled */}
                <Link className={styles.back} to="/prehled">

                    <img className={`${styles.backLogo} ${(this.props.backLabel === undefined ? styles.hide : "")}`} src={backLogo} alt="Back" /> 

                    <div>{this.props.backLabel}</div>

                </Link>

                {/* Odhlášení */}
                <Link className={styles.logout} to="/prihlaseni" onClick={this.logout}>

                    <img className={styles.logoutLogo} src={logoutLogo} alt="Logout" />

                    <div>Odhlášení za {minutes}:{zero}{seconds}</div>

                </Link>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {

    return {
        setUserID: (userID: number) => dispatch(setUserID(userID)),
        changeCurrency: (currency: Currency) => dispatch(changeCurrency(currency))
    }
}

export default connect(null, mapDispatchToProps) (NavigationPanel)
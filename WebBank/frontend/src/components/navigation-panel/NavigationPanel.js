import React, {Component} from "react";
import {Link} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { connect } from "react-redux";
import { setUserID } from "redux/user/userActions";

import styles from "components/navigation-panel/navigation-panel.module.css";
import back from "images/back.png";
import logout from "images/logout.png";

class NavigationPanel extends Component {

    
    /**
     * Konstruktor
     * 
     * @param props 
     */
    constructor(props) {
        super(props)
    
        this.state = {

            // Zbývající vteřiny odpočtu
            secondsLeft: this.props.timeInterval,

            // Čas vypršení JWT
            jwtExpireTime: new Date(),
        }
    }


    /**
     * Nasazení componenty
     */
    componentDidMount() {

        // Nastavení času vypršení JWT
        this.setJwtExpireTime();

        // Přidání click eventu
        document.addEventListener("click", this.handleClick);

        // Spuštění intervalu (1s)
        this.interval = setInterval(() => {

            this.setState({
                secondsLeft: this.state.secondsLeft - 1, 
            });

            if (new Date().getTime() > this.state.jwtExpireTime.getTime()) {

                // Obnovení JWT
                axios.get("http://localhost:8080/api/refresh", {

                    headers: {
                        "Authorization": "Bearer " + Cookies.getJSON("jwt").token
                    }

                }).then(({data: {token, expireTime}}) => {

                    const jwt = {
                        token,
                        expireTime
                    }

                    // vytvoření nového cookies
                    Cookies.set("jwt", jwt, {secure: true});

                    // Nastavení času vypršení nového JWT
                    this.setJwtExpireTime();

                }).catch((error) => console.log(error))
            }

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
     * Nastavení času vypršení JWT
     */
    setJwtExpireTime = () => {

        let jwtExpireTime = new Date(Cookies.getJSON("jwt").expireTime);

        // Odečtení 1 minuty, od vypršení JWT
        jwtExpireTime.setTime(jwtExpireTime.getTime() - (1 * 60 * 1000));

        this.setState({
            jwtExpireTime
        })
    }


    /**
     * Odhlášení
     */
    logout = () => {
        
        // Odstranění cookies
        Cookies.remove("jwt");

        // Vynulování ID uživatele (redux)
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

const mapDispatchToProps = (dispatch) => {

    return {
        setUserID: (userID) => dispatch(setUserID(userID))
    }
}

export default connect(null, mapDispatchToProps) (NavigationPanel)
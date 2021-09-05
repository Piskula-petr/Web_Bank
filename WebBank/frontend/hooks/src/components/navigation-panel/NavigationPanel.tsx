/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { connect } from 'react-redux'
import { Dispatch } from "redux";

import styles from "components/navigation-panel/navigation-panel.module.css";
import back from "images/back.png";
import logoutLogo from "images/logout.png";
import { Currency } from 'redux/currency/currency';
import { setUserID } from "redux/user/userActions";
import { changeCurrency } from 'redux/currency/currencyActions';

interface NavigationPanelProps {
    setUserID: (userID: number) => void,
    changeCurrency: (currency: Currency) => void,
    timeInterval: number,
    backLabel?: string,
}

const NavigationPanel: React.FC<NavigationPanelProps> = (props) => {


    // Zbývající vteřiny odpočtu
    const [ secondsLeft, setSecondsLeft ] = useState<number>(props.timeInterval);


    // Čas vypršení JWT
    const [ jwtExpireTime, setJwtExpireTime ] = useState<Date>(() => {

        const jwtExpireTime: Date = new Date(Cookies.getJSON("jwt").expireTime);

        return jwtExpireTime;
    });


    /**
     * Nasazení componenty
     */
    useEffect(() => {

        // Přidání click eventu
        document.addEventListener("click", handleClick);

        const interval: NodeJS.Timer = setInterval(() => {

            setSecondsLeft(prevSecondsLeft => prevSecondsLeft - 1);

            const TIME_BEFORE_EXPIRE: number = 30 * 1000;   // 30 sekund

            if (new Date().getTime() > (jwtExpireTime.getTime() - TIME_BEFORE_EXPIRE)) {

                // Request - obnovení JWT
                axios.get("http://localhost:8080/api/refresh", {

                    headers: {
                        "Authorization": "Bearer " + Cookies.getJSON("jwt").token
                    }

                }).then(({data: { token, expireTime }}) => {

                    const newJwt = {
                        token,
                        expireTime
                    }

                    // vytvoření nového cookies
                    Cookies.set("jwt", newJwt, {expires: new Date(expireTime), secure: true});

                    setJwtExpireTime(new Date(expireTime));

                }).catch((error) => console.log(error));
            }

            // Odhlášení, při uběhnutí odpočtu
            if (secondsLeft === 0) logout();

        }, 1000);

        return () => {

            clearInterval(interval);

            // Odebrání click eventu
            document.removeEventListener("click", handleClick);
        }

    }, [ jwtExpireTime ])


    /**
     * Resetování odpočtu
     */
    const handleClick = (): void => {

        setSecondsLeft(props.timeInterval);
    }


    /**
     * Odhlášení
     */
    const logout = (): void => {

        // Odstranění cookies
        Cookies.remove("jwt");

        // Vynulování ID uživatele (redux)
        props.setUserID(0);

        // Nastavení výchozí měny (redux)
        props.changeCurrency({
            exchangeRate: 1,
            name: "CZK"
        })
    }


    let minutes: number = Math.floor((secondsLeft / 60) % 60);
    let seconds: number = Math.floor(secondsLeft % 60);

    let zero: string = (seconds < 10 ? "0" : "");

    // Přesměrování na přihlášení, po vypršení odpočtu
    if (secondsLeft === 0) {

        return <Redirect to="/prihlaseni" />
    }

    /**
     * Vykreslení
     */
    return (
        <div className={styles.navigationContainer}>

            {/* Návrat na přehled */}
            <Link className={styles.back} to="/prehled">

                <img className={`${styles.backLogo} ${(props.backLabel === undefined ? styles.hide : "")}`} src={back} alt="Back" /> 

                <div>{props.backLabel}</div>

            </Link>

            {/* Odhlášení */}
            <Link className={styles.logout} to="/prihlaseni" onClick={logout}>

                <img className={styles.logoutLogo} src={logoutLogo} alt="Logout" />

                <div>Odhlášení za {minutes}:{zero}{seconds}</div>

            </Link>
        </div>
    )
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    
    return {
        setUserID: (userID: number) => dispatch(setUserID(userID)),
        changeCurrency: (currency: Currency) => dispatch(changeCurrency(currency))
    }
}

export default connect(null, mapDispatchToProps)(NavigationPanel)

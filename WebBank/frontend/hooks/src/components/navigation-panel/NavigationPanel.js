/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import {Link, Redirect} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { connect } from 'react-redux'
import { setUserID } from "redux/user/userActions";

import styles from "components/navigation-panel/navigation-panel.module.css";
import back from "images/back.png";
import logoutLogo from "images/logout.png";

const NavigationPanel = (props) => {


    // Zbývající vteřiny odpočtu
    const [ secondsLeft, setSecondsLeft ] = useState(props.timeInterval);


    // Čas vypršení JWT
    const [ jwtExpireTime, setJwtExpireTime ] = useState(() => {

        let jwtExpireTime = new Date(Cookies.getJSON("jwt").expireTime);

        // Odečtení 1 minuty, od vypršení JWT
        jwtExpireTime.setTime(jwtExpireTime.getTime() - (1 * 60 * 1000));

        return jwtExpireTime;
    });


    /**
     * Nasazení componenty
     */
    useEffect(() => {

        // Přidání click eventu
        document.addEventListener("click", handleClick);

        const interval = setInterval(() => {

            setSecondsLeft(prevSecondsLeft => prevSecondsLeft - 1);

            if (new Date().getTime() > jwtExpireTime.getTime()) {

                // Request - obnovení JWT
                axios.get("http://localhost:8080/api/refresh", {

                    headers: {
                        "Authorization": "Bearer " + Cookies.getJSON("jwt").token
                    }

                }).then(({data: { token, expireTime }}) => {

                    const jwt = {
                        token,
                        expireTime
                    }

                    // vytvoření nového cookies
                    Cookies.set("jwt", jwt, {expires: new Date(expireTime), secure: true});

                    let jwtNewExpireTime = new Date(Cookies.getJSON("jwt").expireTime);

                    // Odečtení 1 minuty, od vypršení JWT
                    jwtNewExpireTime.setTime(jwtNewExpireTime.getTime() - (1 * 60 * 1000));

                    setJwtExpireTime(jwtNewExpireTime);

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
    const handleClick = (event) => {

        if (event.target.id !== "newPayment") {

            setSecondsLeft(props.timeInterval);
        }
    }


    /**
     * Odhlášení
     */
    const logout = () => {

        // Odstranění cookies
        Cookies.remove("jwt");

        // Vynulování ID uživatele (redux)
        props.setUserID(0)
    }


    let minutes = Math.floor((secondsLeft / 60) % 60);
    let seconds = Math.floor(secondsLeft % 60);

    let zero = (seconds < 10 ? "0" : "");

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

const mapDispatchToProps = (dispatch) => {
    
    return {
        setUserID: (userID) => dispatch(setUserID(userID))
    }
}

export default connect(null, mapDispatchToProps)(NavigationPanel)

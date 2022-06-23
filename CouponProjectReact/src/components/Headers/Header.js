import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import classes from './Header.module.css';
import { authActions } from '../../store/auth';
import Clock from '../UI/Clock';

const Header = () => {

    const name = useSelector(state => state.auth.name);
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.isAuthenticated);

    const newDate = new Date();
    const day = newDate.toLocaleString('en-US', { day: '2-digit' });
    const month = newDate.toLocaleString('en-US', { month: 'long' });
    const year = newDate.getFullYear();
    const date = `${day} ${month} ${year}`;

    const logoutHandler = () => {
        dispatch(authActions.logout());
    }

    return (
        <header className={classes.header}>
            <nav>
                <ul>
                    <li className={classes.timeDate}>
                        <h3>{date}</h3>
                        <Clock/>
                    </li>
                    
                    <li>
                        <h1>Hello {name}!</h1>
                    </li>
                    <li>
                        <button onClick={logoutHandler}>Logout</button>
                    </li>
                    {!isAuth && <Redirect to="/" />}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
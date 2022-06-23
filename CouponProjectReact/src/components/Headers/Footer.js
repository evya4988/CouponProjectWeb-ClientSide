import React from 'react';
import classes from './Footer.module.css';

const Footer = (props) => {

    const aboutHandler = () => {
        props.onAbout();
    };

    return (
        <footer className={classes.footer}>
            © 2022 Copyright
            <button onClick={aboutHandler}>About</button>
        </footer>
    );
}

export default Footer;
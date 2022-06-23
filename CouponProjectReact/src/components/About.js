import React, { Fragment } from 'react';
import classes from './About.module.css';

const About = (props) => {

    const stopShowAbout = () => {
        props.onCancel();
    };

    return (
        <Fragment>
            <div className={classes.about}>
                <div>
                    <p>
                        Hello,
                        <br />Our names are Yonatan Danan and Evyatar Hale, and we are students in John Bryce
                        <br />Academy in Tel Aviv as part of Java Full Stack course.
                    </p>
                    <p>
                        As part of our final project, we were instructed to build a coupon managment system
                        <br />that allows companies to make, edit and delete their coupons, and customers to buy those coupons.
                    </p>
                    <p>
                        A lot of effort was given to this project, which is a product of 5 months of hard work that has taught us a lot.
                        <br />Enjoy!
                    </p>
                </div>
            </div>
            <button className={classes.go_back_button} onClick={stopShowAbout}>Go Back</button>
        </Fragment>
    );
}

export default About;
import './UpdateCustomerForm.css';
import { useState, useRef, useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';

const UpdateCustomerForm = (props) => {

    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const firstNameRef = useRef("");
    const lastNameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isFormValid, setIsFormValid] = useState(false);

    const updateIsFormValidState = () => {
        console.log("First Name: " + firstNameRef.current.value);
        console.log("Last Name: " + lastNameRef.current.value);
        console.log("Email : " + emailRef.current.value);
        console.log("Password: " + passwordRef.current.value);

        setIsFormValid(
            firstNameRef.current.value.trim().length > 0 &&
            lastNameRef.current.value.trim().length > 0 &&
            emailRef.current.value.includes('@') > 0 &&
            passwordRef.current.value.trim().length > 6
        );
    }

    //handler for the "cancel" button
    const cancelHandler = (event) => {
        event.preventDefault();
        props.onClick();
    }

    //handler for the "submit" button
    const submitHandler = useCallback(async (event) => {
        event.preventDefault();

        const customer = {
            id: props.customer.id,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", token: token },
            body: JSON.stringify(customer),
        };

        try {
            console.log("post: " + JSON.stringify(customer));
            const response = await fetch("http://localhost:8080/admin/updateCustomer", requestOptions);
            if (!response.ok) {
                const error = await response.text();
                if (error === "No Session!") {
                    window.alert("Session timeout!");
                    dispatch(authActions.logout());
                    throw new Error("Something went wrong!");
                } else {
                    window.alert(error);
                    props.onClick();
                }
            } else {
                console.log("Response Okay!");
                window.alert("Customer has been updated successfully!");
                props.onUpdate(customer);
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token, props]);

        return (
        <form id="form" onSubmit={submitHandler} >
            <div className='update-inputs'>
                <Fragment>
                    <label>First Name</label>
                    <input placeholder={props.customer.firstName} ref={firstNameRef} onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>Last Name</label>
                    <input type="text" placeholder={props.customer.lastName} ref={lastNameRef} onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>E-Mail</label>
                    <input type="email" placeholder={props.customer.email} ref={emailRef} onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>Password</label>
                    <input type="password" placeholder={props.customer.password} ref={passwordRef} onChange={updateIsFormValidState} />
                </Fragment>
                <div className='update-actions'>
                    <button type='submit' disabled={!isFormValid}>Update</button>
                    <button type='button' id="cancel" onClick={cancelHandler}>Cancel</button>
                </div>
            </div>
        </form>
    );
}


export default UpdateCustomerForm;
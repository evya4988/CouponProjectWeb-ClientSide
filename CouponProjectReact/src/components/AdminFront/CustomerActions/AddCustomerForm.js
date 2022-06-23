import '../CompanyActions/AddCompanyForm.css';
import { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';
import { customersActions } from '../../../store/customers';

const AddCustomerForm = (props) => {

    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const firstNameRef = useRef("");
    const lastNameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isFormValid, setIsFormValid] = useState(false);

    const updateIsFormValidState = () => {
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
            const response = await fetch("http://localhost:8080/admin/addCustomer", requestOptions);
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
                const data = await response.json();
                console.log(data);
                window.alert("Customer has been added successfully!");
                dispatch(customersActions.add(data));
                props.onClick();
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token, props]);

    return (
        <form id="form" onSubmit={submitHandler} >
            <div className='new-expense__controls'>
                <div>
                    <div className='new-expense__control'>
                        <label>First Name</label>
                        <input type="text" ref={firstNameRef} onChange={updateIsFormValidState} />
                    </div>
                    <div className='new-expense__control'>
                        <label>Last Name</label>
                        <input type="text" ref={lastNameRef} onChange={updateIsFormValidState} />
                    </div>
                </div>
                <div>
                    <div className='new-expense__control'>
                        <label>E-Mail</label>
                        <input type="email" ref={emailRef} onChange={updateIsFormValidState} />
                    </div>
                    <div className='new-expense__control'>
                        <label>Password</label>
                        <input type="password" ref={passwordRef} onChange={updateIsFormValidState} />
                    </div>
                </div>
            </div>
            <div className='new-expense__actions'>
                    <button type='submit' disabled={!isFormValid}>Add Customer</button>
                    <button type='button' id="cancel" onClick={cancelHandler}>Cancel</button>

                </div>
        </form>
    );
}

export default AddCustomerForm;
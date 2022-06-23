import './UpdateCompanyForm.css';
import { useState, useRef, useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';

const UpdateCompanyForm = (props) => {

    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const emailRef = useRef(props.company.email);
    const passwordRef = useRef(props.company.password);
    const [isFormValid, setIsFormValid] = useState(false);

    
    const updateIsFormValidState = () => {
        console.log("Name: " + props.company.name);
        console.log("Email : " + emailRef.current.value);
        console.log("Password: " + passwordRef.current.value);

        setIsFormValid(
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

        const company = {
            id: props.company.id,
            name: props.company.name,
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", token: token },
            body: JSON.stringify(company),
        };

        try {
            console.log("post: " + JSON.stringify(company));
            const response = await fetch("http://localhost:8080/admin/updateCompany", requestOptions);
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
                window.alert("Company has been updated successfully!");
                props.onUpdate(company);
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token, props]);

    return (
        <form id="form" onSubmit={submitHandler} >
            <div className='update-inputs'>
                <Fragment>
                    <label>Name</label>
                    <input type="text" value={props.company.name} disabled={true} />
                </Fragment>
                <Fragment>
                    <label>E-Mail</label>
                    <input type="email" placeholder={props.company.email} ref={emailRef} onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>Password</label>
                    <input type="password" placeholder={props.company.password} ref={passwordRef} onChange={updateIsFormValidState} />
                </Fragment>
                <div className='update-actions'>
                    <button type='submit' disabled={!isFormValid}>Update</button>
                    <button type='button' id="cancel" onClick={cancelHandler}>Cancel</button>
                </div>
            </div>
        </form>
    );
}

export default UpdateCompanyForm;
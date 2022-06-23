import './AddCompanyForm.css';
import { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';
import { companiesActions } from '../../../store/companies';

const AddCompanyForm = (props) => {

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isFormValid, setIsFormValid] = useState(false);

  const updateIsFormValidState = () => {
    setIsFormValid(
      nameRef.current.value.trim().length > 0 &&
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
      name: nameRef.current.value,
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
      const response = await fetch("http://localhost:8080/admin/addCompany", requestOptions);
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
        window.alert("Company has been added successfully!");
        dispatch(companiesActions.add(data));
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
            <label>Name</label>
            <input type="text" ref={nameRef} onChange={updateIsFormValidState} />
          </div>
          <div className='new-expense__control'>
            <label>E-Mail</label>
            <input type="email" ref={emailRef} onChange={updateIsFormValidState} />
          </div>
        </div>
        <div>
          <div className='new-expense__control'>
            <label>Password</label>
            <input type="password" ref={passwordRef} onChange={updateIsFormValidState} />
          </div>
          <div className='new-expense__actions'>
            <button type='submit' disabled={!isFormValid}>Add Company</button>
            <button type='button' id="cancel" onClick={cancelHandler}>Cancel</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddCompanyForm;
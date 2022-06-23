import classes from "./Auth.module.css";
import { useCallback, useRef, useState } from "react";
import { authActions } from '../store/auth';
import Select from "react-select";
import { useDispatch } from "react-redux";

const Auth = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [selectedRole, setSelectedRole] = useState(null);

  const dispatch = useDispatch();

  const options = [
    { value: "admin", label: "Admin" },
    { value: "company", label: "Company" },
    { value: "customer", label: "Customer" },
  ];

  const loginHandler = useCallback(async (event) => {
    try {
      event.preventDefault();

      const creds = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        role: selectedRole
      };

      // POST request using fetch inside useEffect React hook
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      };

      console.log("post: " + JSON.stringify(creds));
      const response = await fetch("http://localhost:8080/login/login", requestOptions);
      if (!response.ok) {
        const error = await response.text();
        if (error !== "Unsuccessful Login!") {
          window.alert("Not all the fields has been filled!");
          throw new Error("Authentication Failed!");
        } else {
          window.alert("Please check your credentials!");
        }
      } else {
        console.log("Okay!");
        const answer = await response.json();
        const loginData = {
          token: answer.token,
          name: answer.name,
          id: answer.id,
          role: creds.role
        };
        console.log("Got token: " + loginData.token);
        console.log("Got name: " + loginData.name);
        console.log("Got ID: " + loginData.id);
        dispatch(authActions.login(loginData));
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [dispatch, selectedRole]);

  const roleChangeHandler = e => {
    console.log("selected value: " + e.value);
    setSelectedRole(e.value);
  }

  return (
    <main className={classes.auth}>
      <section>
        <form onSubmit={loginHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" ref={emailRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passwordRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="select">Role</label>
            <Select
              id="select"
              value={options.find(obj => obj.value === selectedRole)}
              options={options}
              onChange={roleChangeHandler}
            />
          </div>
          <button>Login</button>
        </form>
      </section>
    </main>
  );
};

export default Auth;
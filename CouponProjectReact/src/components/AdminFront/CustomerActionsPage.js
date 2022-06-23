import './CompanyActionsPage.css';
import Customers from './CustomerComponents/Customers';
import AddCustomerForm from './CustomerActions/AddCustomerForm';
import { useState, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/auth';
import { customersActions } from '../../store/customers';

function CustomerActionsPage() {

    const token = useSelector((state) => state.auth.token);
    const customers = useSelector((state) => state.customers.customers);
    const dispatch = useDispatch();
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showButton, setShowButton] = useState(true);
    
    const showAddCustomerHandler = () => {
        setShowAddCustomer(true);
    };

    const stopAddCustomerHandler = () => {
        setShowAddCustomer(false);
    };

    const fetchCustomersHandler = useCallback(async () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", token: token },
        };

        try {
            console.log("get all customers!");
            const response = await fetch("http://localhost:8080/admin/getAllCustomers", requestOptions);
            if (!response.ok) {
                const error = await response.text();
                if (error === "No Session!") {
                    window.alert("Session timeout!");
                    dispatch(authActions.logout());
                    throw new Error("Something went wrong!");
                } else {
                    window.alert(error);
                }
            } else {
                console.log("Response Okay!");
                const data = await response.json();
                const fetchedCustomers = data.map((customerData) => {
                    return {
                        id: customerData.id,
                        firstName: customerData.firstName,
                        lastName: customerData.lastName,
                        email: customerData.email,
                        password: customerData.password,
                        coupons: customerData.coupons
                    };
                });
                console.log(JSON.stringify(fetchedCustomers));
                setShowButton(false);
                dispatch(customersActions.getAll(fetchedCustomers));
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token]);

    return (
        <Fragment>
            <div className='add-form'>
                {!showAddCustomer && <button onClick={showAddCustomerHandler}>Add Customer</button>}
                {showAddCustomer && <AddCustomerForm onClick={stopAddCustomerHandler} />}
            </div>
            <div className='fetch-items'>
                {showButton &&
                <section>
                    <button onClick={fetchCustomersHandler}>Fetch Customers</button>
                </section>}
                {!showButton && customers.length > 0 && <Customers customers={customers} />}
                {!showButton && !(customers.length > 0) && <h2>There are no customers!</h2>}
            </div>
        </Fragment>
    );
};

export default CustomerActionsPage;
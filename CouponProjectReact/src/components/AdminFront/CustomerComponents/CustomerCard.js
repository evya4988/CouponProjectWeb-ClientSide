import './Customer.css';
import Customer from "./Customer";
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';
import UpdateCustomerForm from '../CustomerActions/UpdateCustomerForm';
import { customersActions } from '../../../store/customers';

const CustomerCard = (props) => {

    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
    const [customerState, setCustomerState] = useState(
        {
            id: props.customer.id,
            firstName: props.customer.firstName,
            lastName: props.customer.lastName,
            email: props.customer.email,
            password: props.customer.password,
            coupons:props.customer.coupons
        });

    const afterUpdateHandler = (customer) => {
        setCustomerState(customer);
        setIsUpdatingCustomer(false);
    }

    const startDeletingHandler = useCallback(async () => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            const id = props.customer.id;

            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json", token: token },
            };

            try {
                console.log("delete: " + id);
                const response = await fetch("http://localhost:8080/admin/deleteCustomer/" + id, requestOptions);
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
                    const cust = props.customer;
                    console.log("Response Okay!");
                    window.alert("Customer has been deleted successfully!");
                    dispatch(customersActions.delete(cust))
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }, [dispatch, token, props]);

    const startUpdatingHandler = () => {
        setIsUpdatingCustomer(true);
    };

    const stopUpdatingHandler = () => {
        setIsUpdatingCustomer(false);
    };

    return (
        <div className='customer-card'>
            {!isUpdatingCustomer &&
                <div>
                    <Customer customer={customerState} />
                    <div className='actions-div'>
                        <button className='action-button' onClick={startUpdatingHandler}>Update</button>
                        <button className='action-button' onClick={startDeletingHandler}>Delete</button>
                    </div>
                </div>}
            {isUpdatingCustomer && <UpdateCustomerForm customer={customerState} onClick={stopUpdatingHandler} onUpdate={afterUpdateHandler} />}
        </div>
    );
}

export default CustomerCard;
import './Company.css';
import Company from "./Company";
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';
import UpdateCompanyForm from '../CompanyActions/UpdateCompanyForm';
import { companiesActions } from '../../../store/companies';

const CompanyCard = (props) => {

    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
    const [companyState, setCompanyState] = useState(
        {
            id: props.company.id,
            name: props.company.name,
            email: props.company.email,
            password: props.company.password,
            coupons:props.company.coupons
        });

    const afterUpdateHandler = (company) => {
        setCompanyState(company);
        setIsUpdatingCompany(false);
    }

    const startDeletingHandler = useCallback(async () => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            const id = props.company.id;

            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json", token: token },
            };

            try {
                console.log("delete: " + id);
                const response = await fetch("http://localhost:8080/admin/deleteCompany/" + id, requestOptions);
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
                    const comp = props.company;
                    console.log("Response Okay!");
                    window.alert("Company has been deleted successfully!");
                    dispatch(companiesActions.delete(comp))
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }, [dispatch, token, props]);

    const startUpdatingHandler = () => {
        setIsUpdatingCompany(true);
    };

    const stopUpdatingHandler = () => {
        setIsUpdatingCompany(false);
    };

    return (
        <div className='company-card'>
            {!isUpdatingCompany &&
                <div>
                    <Company company={companyState} />
                    <div className='actions-div'>
                        <button className='action-button' onClick={startUpdatingHandler}>Update</button>
                        <button className='action-button' onClick={startDeletingHandler}>Delete</button>
                    </div>
                </div>}
            {isUpdatingCompany && <UpdateCompanyForm company={companyState} onClick={stopUpdatingHandler} onUpdate={afterUpdateHandler} />}
        </div>
    );
}

export default CompanyCard;
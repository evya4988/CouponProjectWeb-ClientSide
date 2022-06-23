import './CompanyActionsPage.css';
import Companies from './CompanyComponents/Companies';
import AddCompanyForm from './CompanyActions/AddCompanyForm';
import { useState, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/auth';
import { companiesActions } from '../../store/companies';

function CompanyActionsPage() {

    const token = useSelector((state) => state.auth.token);
    const companies = useSelector((state) => state.companies.companies);
    const dispatch = useDispatch();
    const [showAddCompany, setShowAddCompany] = useState(false);
    const [showButton, setShowButton] = useState(true);

    const showAddCompanyHandler = () => {
        setShowAddCompany(true);
    };

    const stopAddCompanyHandler = () => {
        setShowAddCompany(false);
    };

    const fetchCompaniesHandler = useCallback(async () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", token: token },
        };

        try {
            console.log("get all companies!");
            const response = await fetch("http://localhost:8080/admin/getAllCompanies", requestOptions);
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
                const fetchedCompanies = data.map((companyData) => {
                    return {
                        id: companyData.id,
                        name: companyData.name,
                        email: companyData.email,
                        password: companyData.password,
                        coupons: companyData.coupons
                    };
                });
                console.log(JSON.stringify(fetchedCompanies));
                setShowButton(false);
                dispatch(companiesActions.getAll(fetchedCompanies));
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token]);

    return (
        <Fragment>
            <div className='add-form'>
                {!showAddCompany && <button onClick={showAddCompanyHandler}>Add Company</button>}
                {showAddCompany && <AddCompanyForm onClick={stopAddCompanyHandler} />}
            </div>
            <div className='fetch-items'>
                {showButton &&
                    <section>
                        <button onClick={fetchCompaniesHandler}>Fetch Companies</button>
                    </section>}
                {!showButton && companies.length > 0 && <Companies companies={companies} />}
                {!showButton && !(companies.length > 0) && <h2>There are no companies!</h2>}
            </div>
        </Fragment>
    );
};

export default CompanyActionsPage;
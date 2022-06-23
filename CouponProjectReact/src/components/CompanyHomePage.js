import Header from './Headers/Header';
import Footer from './Headers/Footer';
import About from './About';
import './AdminFront/CompanyActionsPage.css';
import AddCouponForm from './CompanyFront/CompanyActions/AddCouponForm';
import { useState, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import { couponsActions } from '../store/coupons';
import Coupons from './CompanyFront/CouponComponents/Coupons';
import GetCouponsByMaxPrice from './CompanyFront/CompanyActions/GetCouponsByMaxPrice';
import GetCouponsByMinPrice from './CompanyFront/CompanyActions/GetCouponsByMinPrice';
import GetCouponsByCategory from './CompanyFront/CompanyActions/GetCouponsByCategory';

function CompanyHomePage() {

    const token = useSelector((state) => state.auth.token);
    const companyId = useSelector((state) => state.auth.id);
    const dispatch = useDispatch();
    const coupons = useSelector((state) => state.coupons.coupons);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [showAddCoupon, setShowAddCoupon] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [clearingCategory, setClearingCategory] = useState(false);
    const [clearingPrice, setClearingPrice] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    const showAboutHandler = () => {
        setShowAbout(true);
    }
    const stopAboutHandler = () => {
        setShowAbout(false);
    }

    const filterFetchHandler = (coupons) => {
        setIsFiltering(true);
        setFilteredCoupons(coupons);
    };

    const stopFilteringHandler = () => {
        setIsFiltering(false);
        setClearingCategory(true);
        setClearingPrice(true);
    };

    const showAddCouponHandler = () => {
        setShowAddCoupon(true);
    };

    const stopAddCouponHandler = () => {
        setShowAddCoupon(false);
    };


    const fetchCouponsHandler = useCallback(async () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", token: token },
        };

        try {
            console.log("get all coupons!");
            const response = await fetch("http://localhost:8080/company/getCompanyCoupons/" + companyId, requestOptions);
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
                console.log(JSON.stringify(data));
                const fetchedCoupons = data.map((couponData) => {
                    return {
                        id: couponData.id,
                        companyId: couponData.companyId,
                        category: couponData.category,
                        title: couponData.title,
                        description: couponData.description,
                        startDate: couponData.startDate,
                        endDate: couponData.endDate,
                        amount: couponData.amount,
                        price: couponData.price,
                        image: couponData.image,
                    };
                });
                console.log(JSON.stringify(fetchedCoupons));
                setShowButton(false);
                dispatch(couponsActions.getAll(fetchedCoupons));
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token, companyId]);

    return (
        <div>
            <Header />
            {!showAbout &&
            <Fragment>
            <div className='add-form'>
                {!showAddCoupon && <button className='add-form-button' onClick={showAddCouponHandler}>Add Coupon</button>}
                {showAddCoupon && <AddCouponForm onClick={stopAddCouponHandler} />}
            </div>
            <div className='coupons-filter'>
                <span>
                    <GetCouponsByCategory onClear={clearingCategory} onFetch={filterFetchHandler} />
                </span>
                <span>
                    <GetCouponsByMaxPrice onClear={clearingPrice} onFetch={filterFetchHandler} />
                </span>
                <span>
                    <GetCouponsByMinPrice onClear={clearingPrice} onFetch={filterFetchHandler} />
                </span>
            </div>
            <div className='filter-button'>
                <button onClick={stopFilteringHandler}>Clear Filters</button>
            </div>

            {isFiltering &&
                <div className='filtered-coupons'>
                    {filteredCoupons.length > 0 && <Coupons coupons={filteredCoupons} />}
                    {!(filteredCoupons.length > 0) && <h2>There are no coupons in this filtering!</h2>}
                </div>
            }
            {!isFiltering &&
                <div className='fetch-items'>
                    {showButton &&
                        <section>
                            <button onClick={fetchCouponsHandler}>Fetch Coupons</button>
                        </section>
                    }
                    {!showButton && coupons.length > 0 && <Coupons coupons={coupons} />}
                    {!showButton && !(coupons.length > 0) && <h2>There are no coupons in the company!</h2>}
                </div>
            }
        </Fragment>}
            {showAbout && <About onCancel={stopAboutHandler}/>}
            <Footer onAbout={showAboutHandler}/>
        </div>
    );
}

export default CompanyHomePage;
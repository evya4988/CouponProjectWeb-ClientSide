import './AddCouponForm.css';
import { useCallback, useRef, useState } from 'react';
import { authActions } from '../../../store/auth';
import { useDispatch, useSelector } from 'react-redux';

const GetCouponsByMaxPrice = (props) => {

    const token = useSelector((state) => state.auth.token);
    const companyId = useSelector((state) => state.auth.id);
    const [isValid, setIsValid] = useState(false);
    const dispatch = useDispatch();
    const priceRef = useRef(Number(''));

    const isValidHandler = () => {
        setIsValid(priceRef.current.value > 0);
    };

    const fetchCouponsByMaxPriceHandler = useCallback(async () => {
        const maxPrice = priceRef.current.value;

        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", maxPrice: maxPrice, companyId: companyId, token: token },
        };

        try {
            console.log("get all coupons!");
            const response = await fetch("http://localhost:8080/company/getCompanyCoupons/MaxPrice", requestOptions);
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
                props.onFetch(fetchedCoupons);
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token, props, companyId]);

    return (
        <div className='get-coupons'>
            <input type="text" placeholder='Max Price' ref={priceRef} onChange={isValidHandler}></input>
            <button onClick={fetchCouponsByMaxPriceHandler} disabled={!isValid}>Fetch</button>
        </div>
    );
}

export default GetCouponsByMaxPrice;
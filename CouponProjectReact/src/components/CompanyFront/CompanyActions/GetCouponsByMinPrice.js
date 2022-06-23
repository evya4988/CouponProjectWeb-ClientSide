import './AddCouponForm.css';
import { useCallback, useRef, useState } from 'react';
import { authActions } from '../../../store/auth';
import { useDispatch, useSelector } from 'react-redux';

const GetCouponsByMinPrice = (props) => {

    const role = useSelector((state) => state.auth.role);
    const token = useSelector((state) => state.auth.token);
    const id = useSelector((state) => state.auth.id);
    const [isValid, setIsValid] = useState(false);
    const dispatch = useDispatch();
    const priceRef = useRef(Number(''));

    const isValidHandler = () => {
        setIsValid(priceRef.current.value > 0);
    };

    const fetchCouponsByMinPriceHandler = useCallback(async () => {
        const minPrice = priceRef.current.value;

        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", minPrice: minPrice, id: id, token: token },
        };

        try {
            console.log("get all coupons!");
            const response = await fetch("http://localhost:8080/"+ role +"/get"
            + role.slice(0,1).toUpperCase() + role.slice(1, role.length) +"Coupons/MinPrice", requestOptions);
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
                props.onFetch(fetchedCoupons);
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token, props, id, role]);

    return (
        <div className='get-coupons'>
            <input type="text" placeholder='Min Price' ref={priceRef} onChange={isValidHandler}></input>
            <button onClick={fetchCouponsByMinPriceHandler} disabled={!isValid}>Fetch</button>
        </div>
    );
}

export default GetCouponsByMinPrice;
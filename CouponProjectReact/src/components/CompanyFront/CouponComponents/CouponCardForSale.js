import Coupon from "./Coupon";
import './Coupon.css';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';
import { couponsActions } from '../../../store/coupons';

const CouponCardForSale = (props) => {

    const customerId = useSelector((state) => state.auth.id);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const startPurchasingHandler = useCallback(async () => {
        if (window.confirm("Are you sure you want to purchase this coupon?")) {
            const couponId = props.coupon.id;

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", customerId: customerId, token: token },
            };

            try {
                console.log("purchase: " + couponId);
                const response = await fetch("http://localhost:8080/customer/purchaseCoupon/" + couponId, requestOptions);
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
                    window.alert("Coupon has been purchased successfully!");
                    dispatch(couponsActions.updatePurchaseCoupons(props.coupon));
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }, [dispatch, token, customerId, props]);

    return (
        <div className='coupon-card'>
            <div>
                <Coupon coupon={props.coupon} />
                <div className='actions-div'>
                    <button className='action-button' onClick={startPurchasingHandler}>Purchase</button>
                </div>
            </div>
        </div>
    );
}

export default CouponCardForSale;
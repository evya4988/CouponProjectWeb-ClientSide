import Coupon from "./Coupon";
import './Coupon.css';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';
import UpdateCouponForm from '../CompanyActions/UpdateCouponForm';
import { couponsActions } from '../../../store/coupons';

const CouponCard = (props) => {

    const companyId = useSelector((state) => state.auth.id);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [isUpdatingCoupon, setIsUpdatingCoupon] = useState(false);
    const [couponState, setCouponState] = useState(
        {
            id: props.coupon.id,
            companyId: props.coupon.companyId,
            title: props.coupon.title,
            description: props.coupon.description,
            category: props.coupon.category,
            startDate: props.coupon.startDate,
            endDate: props.coupon.endDate,
            amount: props.coupon.amount,
            price: props.coupon.price,
            image: props.coupon.image
        });

    const afterUpdateHandler = (coupon) => {
        setCouponState(coupon);
        setIsUpdatingCoupon(false);
    }

    const startDeletingHandler = useCallback(async () => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            const id = props.coupon.id;

            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json", companyId: companyId, token: token },
            };

            try {
                console.log("delete: " + id);
                const response = await fetch("http://localhost:8080/company/deleteCoupon/" + id, requestOptions);
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
                    const coupon = props.coupon;
                    console.log("Response Okay!");
                    window.alert("Coupon has been deleted successfully!");
                    dispatch(couponsActions.delete(coupon))
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }, [dispatch, token, companyId, props]);

    const startUpdatingHandler = () => {
        setIsUpdatingCoupon(true);
    };

    const stopUpdatingHandler = () => {
        setIsUpdatingCoupon(false);
    };

    return (
        <div className='coupon-card'>
            {!isUpdatingCoupon &&
                <div>
                    <Coupon coupon={couponState} />
                    <div className='actions-div'>
                        <button className='action-button' onClick={startUpdatingHandler}>Update</button>
                        <button className='action-button' onClick={startDeletingHandler}>Delete</button>
                    </div>
                </div>}
            {isUpdatingCoupon && <UpdateCouponForm coupon={couponState} onClick={stopUpdatingHandler} onUpdate={afterUpdateHandler} />}
        </div>
    );
}

export default CouponCard;
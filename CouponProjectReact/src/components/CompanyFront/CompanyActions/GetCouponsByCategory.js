import './AddCouponForm.css';
import { useCallback, useState } from 'react';
import { authActions } from '../../../store/auth';
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";

const GetCouponsByCategory = (props) => {

    const role = useSelector((state) => state.auth.role);
    const token = useSelector((state) => state.auth.token);
    const id = useSelector((state) => state.auth.id);
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const options = [
        { value: "0", label: "Food" },
        { value: "1", label: "Electricity" },
        { value: "2", label: "Restaurant" },
        { value: "3", label: "Vacation" },
    ];

    const categoryChangeHandler = e => {
        console.log("selected value: " + e.value);
        setSelectedCategory(e.value);
    };

    const fetchCouponsByCategoryHandler = useCallback(async () => {
        const category = +selectedCategory;

        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", id: id, token: token },
        };

        try {
            console.log("get all coupons!");
            const response = await fetch("http://localhost:8080/"+ role + "/get"
             + role.slice(0,1).toUpperCase() + role.slice(1, role.length) +"CouponsByCategory/" + category, requestOptions);
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
    }, [dispatch, token, props, selectedCategory, id, role]);

    return (
        <div className='get-coupons'>
            <Select
                id="select"
                className='select'
                value={options.find(obj => obj.value === selectedCategory)}
                options={options}
                onChange={categoryChangeHandler}
            />
            <button onClick={fetchCouponsByCategoryHandler} disabled={selectedCategory === null}>Filter By Category</button>
        </div>
    );
}

export default GetCouponsByCategory;
import '../../AdminFront/CompanyActions/UpdateCompanyForm.css';
import { useState, useRef, useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";
import { authActions } from '../../../store/auth';

const UpdateCouponForm = (props) => {

    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const companyId = useSelector((state) => state.auth.id);
    const descriptionRef = useRef(props.coupon.description);
    const priceRef = useRef(props.coupon.price);
    const amountRef = useRef(props.coupon.amount);
    const imageRef = useRef(props.coupon.image);
    const startDateRef = useRef(props.coupon.startDate);
    const endDateRef = useRef(props.coupon.endDate);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const newDate = new Date();
    const day = newDate.toLocaleString('en-US', { day: '2-digit' });
    const month = newDate.toLocaleString('en-US', { month: '2-digit' });
    const year = newDate.getFullYear();
    const date = `${year}-${month}-${day}`;

    const updateIsFormValidState = () => {
        console.log(date);
        console.log("Name: " + props.coupon.title);
        console.log("Description : " + descriptionRef.current.value);
        console.log("Category : " + selectedCategory);
        console.log("Price: " + priceRef.current.value);
        console.log("Start Date: " + startDateRef.current.value);
        console.log("End Date: " + endDateRef.current.value);
        console.log("Amount: " + amountRef.current.value);
        console.log("Image: " + imageRef.current.value);

        setIsFormValid(
            descriptionRef.current.value.trim().length > 0 &&
            priceRef.current.value > 0 &&
            amountRef.current.value > 0 &&
            startDateRef.current.value !== null &&
            endDateRef.current.value !== null &&
            imageRef.current.value.trim().length > 0 &&
            selectedCategory !== null
        );
    }


    //handler for the "cancel" button
    const cancelHandler = (event) => {
        event.preventDefault();
        props.onClick();
    }

    //handler for the "submit" button
    const submitHandler = useCallback(async (event) => {
        event.preventDefault();

        const coupon = {
            id: props.coupon.id,
            companyId: companyId,
            title: props.coupon.title,
            description: descriptionRef.current.value,
            price: priceRef.current.value,
            startDate: startDateRef.current.value,
            endDate: endDateRef.current.value,
            amount: amountRef.current.value,
            image: imageRef.current.value,
            category: selectedCategory
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", token: token },
            body: JSON.stringify(coupon),
        };

        try {
            console.log("post: " + JSON.stringify(coupon));
            const response = await fetch("http://localhost:8080/company/updateCoupon", requestOptions);
            if (!response.ok) {
                const error = await response.text();
                console.log(error);
                if (error === "No Session!") {
                    window.alert("Session timeout!");
                    dispatch(authActions.logout());
                    throw new Error("Something went wrong!");
                } else {
                    window.alert(error);
                    props.onClick();
                }
            } else {
                console.log("Response Okay!");
                const categoryName = await response.text();
                const updatedCoupon = {
                    id: coupon.id,
                    companyId: coupon.companyId,
                    title: coupon.title,
                    description: coupon.description,
                    price: coupon.price,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                    amount: coupon.amount,
                    image: coupon.image,
                    category: categoryName
                };
                window.alert("Coupon has been updated successfully!");
                props.onUpdate(updatedCoupon);
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [dispatch, token, props, companyId, selectedCategory]);

    const options = [
        { value: "0", label: "Food" },
        { value: "1", label: "Electricity" },
        { value: "2", label: "Restaurant" },
        { value: "3", label: "Vacation" },
    ];

    const categoryChangeHandler = e => {
        console.log("selected value: " + e.value);
        setSelectedCategory(e.value);
    }

    return (
        <form id="form" onSubmit={submitHandler} >
            <div className='update-inputs'>
                <Fragment>
                    <label>Title</label>
                    <input type="text" value={props.coupon.title} disabled={true} />
                </Fragment>
                <Fragment>
                    <label>Description</label>
                    <input type="textarea" placeholder={props.coupon.description} ref={descriptionRef} onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label htmlFor="select">Category</label>
                    <Select
                        id="select"
                        className='select'
                        placeholder={props.coupon.category}
                        value={options.find(obj => obj.value === selectedCategory)}
                        options={options}
                        onChange={categoryChangeHandler}
                    />
                </Fragment>
                <Fragment>
                    <label>Start Date</label>
                    <input type="date" ref={startDateRef} min={date}
                        onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>End Date</label>
                    <input type="date" ref={endDateRef} min={date}
                        onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>Price</label>
                    <input type="text" placeholder={props.coupon.price} ref={priceRef} onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>Amount</label>
                    <input type="text" placeholder={props.coupon.amount} ref={amountRef} onChange={updateIsFormValidState} />
                </Fragment>
                <Fragment>
                    <label>Image</label>
                    <input type="text" placeholder={props.coupon.image} ref={imageRef} onChange={updateIsFormValidState} />
                </Fragment>
                <div className='update-actions'>
                    <button type='submit' disabled={!isFormValid}>Update</button>
                    <button type='button' id="cancel" onClick={cancelHandler}>Cancel</button>
                </div>
            </div>
        </form>
    );
}

export default UpdateCouponForm;
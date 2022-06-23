import './AddCouponForm.css';
import { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../../store/auth';
import { couponsActions } from '../../../store/coupons';
import Select from "react-select";

const AddCouponForm = (props) => {

  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const companyId = useSelector((state) => state.auth.id);
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const priceRef = useRef("");
  const amountRef = useRef("");
  const imageRef = useRef("");
  const startDateRef = useRef("");
  const endDateRef = useRef("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const newDate = new Date();
  const day = newDate.toLocaleString('en-US', { day: '2-digit' });
  const month = newDate.toLocaleString('en-US', { month: '2-digit' });
  const year = newDate.getFullYear();
  const date = `${year}-${month}-${day}`;

  const updateIsFormValidState = () => {
    console.log("Title: " + titleRef.current.value);
    console.log("Description : " + descriptionRef.current.value);
    console.log("Category : " + selectedCategory);
    console.log("Price: " + priceRef.current.value);
    console.log("Start Date: " + startDateRef.current.value);
    console.log("End Date: " + endDateRef.current.value);
    console.log("Amount: " + amountRef.current.value);
    console.log("Image: " + imageRef.current.value);

    setIsFormValid(
      titleRef.current.value.trim().length > 0 &&
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
      companyId: companyId,
      category: selectedCategory,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      startDate: startDateRef.current.value,
      endDate: endDateRef.current.value,
      amount: amountRef.current.value,
      price: priceRef.current.value,
      image: imageRef.current.value,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", token: token },
      body: JSON.stringify(coupon),
    };

    try {
      console.log("post: " + JSON.stringify(coupon));
      console.log("start date: " + coupon.startDate)
      const response = await fetch("http://localhost:8080/company/addCoupon", requestOptions);
      if (!response.ok) {
        const error = await response.text();
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
        const data = await response.json();
        console.log(data);
        window.alert("Coupon has been added successfully!");
        dispatch(couponsActions.add(data));
        props.onClick();
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [dispatch, token, companyId, selectedCategory, props]);

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
      <div className='new-coupon__controls'>
        <div>
          <div className='new-coupon__control'>
            <label>Title</label>
            <input type="text" ref={titleRef} onChange={updateIsFormValidState} />
          </div>
          <div className='new-coupon__control'>
            <label>Description</label>
            <input type="textarea" ref={descriptionRef} onChange={updateIsFormValidState} />
          </div>
          <div className='new-coupon__control'>
            <label>Price</label>
            <input type="text" ref={priceRef} onChange={updateIsFormValidState} />
          </div>
          <div className='new-coupon__control'>
            <label>Amount</label>
            <input type="text" ref={amountRef} onChange={updateIsFormValidState} />
          </div>
        </div>
        <div>
          <div className='new-coupon__control'>
            <label>Start Date</label>
            <input type="date" ref={startDateRef} min={date}
              onChange={updateIsFormValidState} />
          </div>
          <div className='new-coupon__control'>
            <label>End Date</label>
            <input type="date" ref={endDateRef} min={date}
              onChange={updateIsFormValidState} />
          </div>
          <div className='new-coupon__control'>
            <label htmlFor="select">Category</label>
            <Select
              id="select"
              className='select'
              value={options.find(obj => obj.value === selectedCategory)}
              options={options}
              onChange={categoryChangeHandler}
            />
          </div>
          <div className='new-coupon__control'>
            <label>Image</label>
            <input type="text" ref={imageRef} onChange={updateIsFormValidState} />
          </div>
        </div>
      </div>
      <div className='new-coupon__actions'>
        <button type='submit' disabled={!isFormValid}>Add Coupon</button>
        <button type='button' id="cancel" onClick={cancelHandler}>Cancel</button>
      </div>
    </form>
  );
}

export default AddCouponForm;
import './Coupon.css';

const Coupon = (props) => {

    return (
        <div className='coupon'>
            <h1>{props.coupon.title}</h1>
            <h2>{props.coupon.description}</h2>
            <h2>Category: {props.coupon.category}</h2>
            <img src={props.coupon.image} alt='coupon-pic'/>
            <h4>Amount: {props.coupon.amount}</h4>
            <h2>{props.coupon.price}₪</h2>
            <h3>{props.coupon.startDate}   ---   {props.coupon.endDate}</h3>
        </div>
    );
}

export default Coupon;
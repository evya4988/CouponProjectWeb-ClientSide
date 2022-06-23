import Coupon from '../CompanyFront/CouponComponents/Coupon';

const Modal = (props) => {

  const coupons = props.coupons.map((couponsData) => {
    return <Coupon key={Math.random()+''} coupon={couponsData} />;
  });

  return (
    <div className='modal'>
      {coupons}
    </div>
  );
}

export default Modal;
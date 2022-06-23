import CouponCardForSale from '../CompanyFront/CouponComponents/CouponCardForSale';

const PurchaseModal = (props) => {

  const coupons = props.coupons.map((couponsData) => {
    return <CouponCardForSale key={Math.random()+''} coupon={couponsData}/>;
  });  

  return (
    <div className='modal-purchase'>
      {coupons}
    </div>
  );
}

export default PurchaseModal;
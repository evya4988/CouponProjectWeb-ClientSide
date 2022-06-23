import { Fragment } from 'react';
import CouponCard from './CouponCard';

const Coupons = (props) => {

  const couponsContent = props.coupons.map((couponsData) => {
    return <CouponCard key={Math.random() + ''} coupon={couponsData} />;
  });

  return (
    <Fragment>
      {couponsContent}
    </Fragment>
  );
};

export default Coupons;
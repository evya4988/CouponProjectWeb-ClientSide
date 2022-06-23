import { Fragment } from 'react';
import CustomerCard from './CustomerCard';

const Customers = (props) => {

  const customersContent = props.customers.map((customerData) => {
    return <CustomerCard key={Math.random()+''} customer={customerData} />;
  });

  return (
      <Fragment>
        {customersContent}
      </Fragment>
  );
};

export default Customers;
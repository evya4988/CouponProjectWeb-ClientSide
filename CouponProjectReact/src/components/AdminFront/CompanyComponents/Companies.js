import { Fragment } from 'react';
import CompanyCard from './CompanyCard';

const Companies = (props) => {

  const copmaniesContent = props.companies.map((companyData) => {
    return <CompanyCard key={Math.random() + ''} company={companyData}/>;
  });

  return (
    <Fragment>
      {copmaniesContent}
    </Fragment>
  );
};

export default Companies;
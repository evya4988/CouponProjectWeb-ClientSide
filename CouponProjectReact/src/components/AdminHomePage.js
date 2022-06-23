import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import CompanyActionsPage from './AdminFront/CompanyActionsPage';
import CustomerActionsPage from './AdminFront/CustomerActionsPage';
// import NotFound from './NotFound';
import Header from './Headers/Header';
import classes from './Headers/Header.module.css';
import Footer from './Headers/Footer';
import About from './About';

function AdminHomePage() {

    const [showAbout, setShowAbout] = useState(false);
    const [deployRedirectCompanyPage, setDeployRedirectCompanyPage] = useState(false);
    const [deployRedirectCustomerPage, setDeployRedirectCustomerPage] = useState(false);

    const showAboutHandler = () => {
        setShowAbout(true);
    }
    const stopAboutHandler = () => {
        setShowAbout(false);
    }

    const deployRedirectCompanyPageHandler = () => {
        setDeployRedirectCompanyPage(true);
        setDeployRedirectCustomerPage(false);
    }
    const deployRedirectCustomerPageHandler = () => {
        setDeployRedirectCompanyPage(false);
        setDeployRedirectCustomerPage(true);
    }

    return (
        <div>
            <Header />
            {!showAbout &&
            <Router>
                <div className={classes.admin_page}>
                    <ol>
                        <button onClick={deployRedirectCompanyPageHandler} >Company Actions Page</button>
                        {deployRedirectCompanyPage && <Redirect to="/CompanyActionsPage" />}
                        <p></p>
                        <button onClick={deployRedirectCustomerPageHandler} >Customer Actions Page</button>
                        {deployRedirectCustomerPage && <Redirect to="/CustomerActionsPage" />}
                    </ol>
                </div>
                <main>
                    <Switch>
                        <Route path='/CompanyActionsPage' exact>
                            <CompanyActionsPage />
                        </Route>
                        <Route path='/CustomerActionsPage' exact>
                            <CustomerActionsPage />
                        </Route>
                    </Switch>
                </main>
            </Router>}
            {showAbout && <About onCancel={stopAboutHandler}/>}
            <Footer onAbout={showAboutHandler}/>
        </div>
    );
}

export default AdminHomePage;
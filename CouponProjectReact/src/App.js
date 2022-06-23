import { Fragment, useEffect } from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminHomePage from './components/AdminHomePage';
import CompanyHomePage from './components/CompanyHomePage';
import CustomerHomePage from './components/CustomerHomePage';
import Auth from './components/Auth';
import { authActions } from './store/auth';

function App() {

  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const role = useSelector(state => state.auth.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedLoggedInInfo = localStorage.getItem('isLoggedIn');
    const storedTokenInfo = localStorage.getItem('token');
    const storedRoleInfo = localStorage.getItem('role');
    const storedNameInfo = localStorage.getItem('name');
    const storedIdInfo = localStorage.getItem('id');
    if (storedLoggedInInfo === "true") {
      const data = {
        token: storedTokenInfo,
        name: storedNameInfo,
        role: storedRoleInfo,
        id: storedIdInfo
      };
      dispatch(authActions.login(data));
    } else {
      dispatch(authActions.logout());
    }
  }, [dispatch]);

  return (

    <Fragment>
      {!isAuth && <Auth />}
      <Router>
        {isAuth && (role === "admin") && <Redirect to='/AdminHomePage' />}
        {isAuth && (role === "company") && <Redirect to='/CompanyHomePage' />}
        {isAuth && (role === "customer") && <Redirect to='/CustomerHomePage' />}

        <main>
          <Switch>
            <Route path='/AdminHomePage' exact>
              <AdminHomePage />
            </Route>
            <Route path='/CompanyHomePage' exact>
              <CompanyHomePage />
            </Route>
            <Route path='/CustomerHomePage' exact>
              <CustomerHomePage />
            </Route>
          </Switch>
        </main>
      </Router>
    </Fragment>
  );
}

export default App;
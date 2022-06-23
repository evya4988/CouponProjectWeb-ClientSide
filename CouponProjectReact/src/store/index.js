import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import companiesReducer from './companies';
import couponsReducer from './coupons';
import customersReducer from './customers';

const store = configureStore({
  reducer: { auth: authReducer , companies: companiesReducer, customers: customersReducer, coupons:couponsReducer},
});

export default store;
import { createSlice } from '@reduxjs/toolkit';

const initialCustomersState = {
  customers: []
};

const customersSlice = createSlice({
  name: 'customers',
  initialState: initialCustomersState,
  reducers: {
    getAll(state, action) {
      state.customers = action.payload;
    },
    add(state, action) {
      const data = action.payload;
      state.customers = [...state.customers, data];
      console.log(data);
    },
    update(state, action) {
      const data = action.payload;
      const filteredCustomers = state.customers.filter((customer) => {
        if (customer.id !== data.id) {
          return customer;
        }
      });
      state.customers = [...filteredCustomers, data];
    },
    delete(state, action) {
      const data = action.payload;
      const filteredCustomers = state.customers.filter((customer) => {
        if (customer.id !== data.id) {
          return customer;
        }
      });
      state.customers = filteredCustomers;
    }
  }
});

export const customersActions = customersSlice.actions;

export default customersSlice.reducer;
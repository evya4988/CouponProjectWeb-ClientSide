import { createSlice } from '@reduxjs/toolkit';

const initialCompaniesState = {
  companies: []
};

const companiesSlice = createSlice({
  name: 'companies',
  initialState: initialCompaniesState,
  reducers: {
    getAll(state, action) {
      state.companies = action.payload;
    },
    add(state, action) {
      const data = action.payload;
      state.companies = [...state.companies, data];
      console.log(data);
    },
    update(state, action) {
      const data = action.payload;
      const filteredCompanies = state.companies.filter((company) => {
        if (company.id !== data.id) {
          return company;
        }
      });
      state.companies = [...filteredCompanies, data];
    },
    delete(state, action) {
      const data = action.payload;
      const filteredCompanies = state.companies.filter((company) => {
        if (company.id !== data.id) {
          return company;
        }
      });
      state.companies = filteredCompanies;
    }
  }
});

export const companiesActions = companiesSlice.actions;

export default companiesSlice.reducer;
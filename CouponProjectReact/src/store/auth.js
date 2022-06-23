import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isAuthenticated: false,
  token: 0,
  name: '',
  role: '',
  id: ''
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      const data = action.payload;
      state.token = data.token;
      state.name = data.name;
      state.role = data.role;
      state.id = data.id;
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      localStorage.setItem('id', data.id);
      console.log("Save the new token: "+state.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = 0;
      state.role = '';
      state.name = '';
      state.id = '';
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('id');
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
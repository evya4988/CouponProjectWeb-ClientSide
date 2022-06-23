import { createSlice } from '@reduxjs/toolkit';

const initialCouponsState = {
  coupons: [],
  purchaseCoupons: []
};

const couponsSlice = createSlice({
  name: 'coupons',
  initialState: initialCouponsState,
  reducers: {
    getAll(state, action) {
      state.coupons = action.payload;
    },
    add(state, action) {
      const data = action.payload;
      state.coupons = [...state.coupons, data];
      console.log(data);
    },
    update(state, action) {
      const data = action.payload;
      const filteredCoupons = state.coupons.filter((coupon) => {
        if (coupon.id !== data.id) {
          return coupon;
        }
      });
      state.coupons = [...filteredCoupons, data];
    },
    delete(state, action) {
      const data = action.payload;
      const filteredCoupons = state.coupons.filter((coupon) => {
        if (coupon.id !== data.id) {
          return coupon;
        }
      });
      state.coupons = filteredCoupons;
    },
    getPurchaseCoupons(state, action) {
      state.purchaseCoupons = action.payload;
    },
    updatePurchaseCoupons(state, action) {
      const data = action.payload;
      const filteredCoupons = state.purchaseCoupons.filter((coupon) => {
        if (coupon.id !== data.id) {
          return coupon;
        }
      });
      state.purchaseCoupons = filteredCoupons;
      state.coupons = [...state.coupons, data];
    }
  }
});

export const couponsActions = couponsSlice.actions;

export default couponsSlice.reducer;
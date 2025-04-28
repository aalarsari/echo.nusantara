import { createSlice } from "@reduxjs/toolkit";

const paymentMethodSlice = createSlice({
  name: "paymentMethod",
  initialState: {
    selectedPaymentMethod: null,
    paymentMethod: [],
  },
  reducers: {
    setPaymentMethods(state, action) {
      state.paymentMethod = action.payload;
    },
    setSelectedPaymentMethod(state, action) {
      state.selectedPaymentMethod = action.payload;
    },
  },
});

export const { setPaymentMethods, setSelectedPaymentMethod } =
  paymentMethodSlice.actions;
export const paymentMethodReducer = paymentMethodSlice.reducer;

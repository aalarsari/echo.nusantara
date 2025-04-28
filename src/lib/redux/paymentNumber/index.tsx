import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentMethod {
  id: number;
  name: string;
  subname: string;
  isActive: boolean;
}

interface PaymentNumber {
  selectedPaymentMethod: PaymentMethod | null;
  vaNumber: string;
  orderId: string;
  billerCode: string;
}

const initialState: PaymentNumber = {
  selectedPaymentMethod: null,
  vaNumber: "",
  orderId: "",
  billerCode: "",
};

export const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setVaNumber: (state, action: PayloadAction<string>) => {
      state.vaNumber = action.payload;
    },
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
    setBillerCode: (state, action: PayloadAction<string>) => {
      state.billerCode = action.payload;
    },
  },
});

export const { setVaNumber, setOrderId, setBillerCode } = PaymentSlice.actions;
export const paymentReducer = PaymentSlice.reducer;

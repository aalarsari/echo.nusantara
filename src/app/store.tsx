import { cartReducer } from "@/lib/redux/cartId";
import { paymentMethodReducer } from "@/lib/redux/paymentMethod";
import { paymentReducer } from "@/lib/redux/paymentNumber";
import { pinReducer } from "@/lib/redux/pinCount";
import { translate } from "@/lib/redux/translate";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    pin: pinReducer,
    language: translate,
    payment: paymentReducer,
    cart: cartReducer,
    paymentMethod: paymentMethodReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

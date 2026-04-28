import { configureStore } from "@reduxjs/toolkit";
import manualSignReducer from "../pages/manual-sign-page/reducer";

const store = configureStore({
  reducer: {
    manualSign: manualSignReducer,
  },
  /**
   * removing error for non-serializable value detected on redux toolkit
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export default store;

export type StoreDispatch = typeof store.dispatch;

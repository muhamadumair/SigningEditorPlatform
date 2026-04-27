import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import manualSignReducer from "../pages/manual-sign-page/reducer";
import { composeWithDevTools } from '@redux-devtools/extension';
import logger from "redux-logger";

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

import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./searchSlice";
import uiSlice from "./uiSlice";

export const store = configureStore({
  reducer: {
    search: searchSlice,
    layout:uiSlice
  },
});

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false, 
};

const uiSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
  },
});

export const {toggleDrawer } = uiSlice.actions;
export default uiSlice.reducer;
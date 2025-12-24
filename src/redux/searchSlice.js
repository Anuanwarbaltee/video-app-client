import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    filters: {
        search: "",
    }
}

const searchSlice = createSlice({
    name: "filter",
    initialState,
    
    reducers: {
        addFilter: (state, action) => {
            state.filters = action.payload
        }
    }
})

export const { addFilter } = searchSlice.actions;
export default searchSlice.reducer
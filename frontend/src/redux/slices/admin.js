import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { action } from "mobx";

export const fetchGetAllUsers = createAsyncThunk(
   "users/fetchGetAllUsers",
   async () => {
      const { data } = await axios.get("/user");
      return data;
   }
);

const initialState = {
   adminData: [],
   status: "loading",
};

const adminSlice = createSlice({
   name: "admin",
   initialState,
   extraReducers: {
      // получение всех пользователей
      [fetchGetAllUsers.pending]: (state, action) => {
         state.adminData = null;
         state.status = "loading";
      },
      [fetchGetAllUsers.fulfilled]: (state, action) => {
         state.adminData = action.payload;
         state.status = "loaded";
      },
      [fetchGetAllUsers.rejected]: (state, action) => {
         state.adminData = null;
         state.status = "error";
      },
   },
});

export const adminReducer = adminSlice.reducer;


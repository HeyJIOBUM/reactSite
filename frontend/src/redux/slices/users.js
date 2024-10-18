import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchLogin = createAsyncThunk(
   "users/fetchLogin",
   async (params) => {
      const { data } = await axios.post("/user/login", params);
      return data;
   }
);

export const fetchRegister = createAsyncThunk(
   "users/fetchRegister",
   async (params) => {
      const { data } = await axios.post("/user/register", params);
      return data;
   }
);

export const fetchGetMe = createAsyncThunk("users/fetchGetMe", async () => {
   const { data } = await axios.get("/user/me");
   return data;
});

const initialState = {
   userData: null,
   status: "loading",
};

const usersSlice = createSlice({
   name: "users",
   initialState,
   reducers: {
      logout: (state) => {
         state.userData = null;
      },
   },
   extraReducers: {
      // логин
      [fetchLogin.pending]: (state, action) => {
         state.userData = null;
         state.status = "loading";
      },
      [fetchLogin.fulfilled]: (state, action) => {
         state.userData = action.payload;
         state.status = "loaded";
      },
      [fetchLogin.rejected]: (state, action) => {
         state.userData = null;
         state.status = "error";
      },
      // получение информации о себе
      [fetchGetMe.pending]: (state, action) => {
         state.userData = null;
         state.status = "loading";
      },
      [fetchGetMe.fulfilled]: (state, action) => {
         state.userData = action.payload;
         state.status = "loaded";
      },
      [fetchGetMe.rejected]: (state, action) => {
         state.userData = null;
         state.status = "error";
      },
      // регистрация
      [fetchRegister.pending]: (state, action) => {
         state.userData = null;
         state.status = "loading";
      },
      [fetchRegister.fulfilled]: (state, action) => {
         state.userData = action.payload;
         state.status = "loaded";
      },
      [fetchRegister.rejected]: (state, action) => {
         state.userData = null;
         state.status = "error";
      },
   },
});

export const selectGetData = (state) => state.users.userData;

export const usersReducer = usersSlice.reducer;

export const { logout } = usersSlice.actions;

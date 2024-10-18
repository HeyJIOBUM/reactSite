import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { action } from "mobx";

export const fetchGetBasket = createAsyncThunk(
   "users/fetchGetBasket",
   async (params) => {
      const { data } = await axios.get("/user/basket", {
         params: {
            productName: params.searchParams.productName,
            productType: params.searchParams.productType,
            producer: params.searchParams.producer,
            price: {
               min: params.searchParams.priceMin,
               max: params.searchParams.priceMax,
            },
            sorting: params.searchParams.sorting,
         },
      });
      return data;
   }
);

export const fetchGetSellerBasket = createAsyncThunk(
   "users/fetchGetBasket",
   async (params) => {
      const { data } = await axios.get("/user/basket/" + params._id, {
         params: {
            productName: params.searchParams.productName,
            productType: params.searchParams.productType,
            producer: params.searchParams.producer,
            price: {
               min: params.searchParams.priceMin,
               max: params.searchParams.priceMax,
            },
            sorting: params.searchParams.sorting,
         },
      });
      return data;
   }
);

const initialState = {
   items: [],
   basketRole: "",
   status: "loading",
};

const basketSlice = createSlice({
   name: "basket",
   initialState,
   reducers: {},
   // получение содержимого корзины
   extraReducers: {
      [fetchGetBasket.pending]: (state, action) => {
         state.items = [];
         state.basketRole = "";
         state.status = "loading";
      },
      [fetchGetBasket.fulfilled]: (state, action) => {
         state.items = action.payload.basket;
         state.basketRole = action.payload.role;
         state.status = "loaded";
      },
      [fetchGetBasket.rejected]: (state, action) => {
         state.items = [];
         state.basketRole = "";
         state.status = "error";
      },
   },
});

export const basketReducer = basketSlice.reducer;

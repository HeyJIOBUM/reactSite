import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { action } from "mobx";

export const fetchProducts = createAsyncThunk(
   "products/fetchProducts",
   async (params) => {
      const { data } = await axios.get("/product", {
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
   status: "loading",
};

const productsSlice = createSlice({
   name: "products",
   initialState,
   reducers: {},
   extraReducers: {
      //получить все товары
      [fetchProducts.pending]: (state, action) => {
         state.status = "loading";
      },
      [fetchProducts.fulfilled]: (state, action) => {
         state.items = action.payload;
         state.status = "loaded";
      },
      [fetchProducts.rejected]: (state, action) => {
         state.items = [];
         state.status = "error";
      },
   },
});

export const productsReducer = productsSlice.reducer;

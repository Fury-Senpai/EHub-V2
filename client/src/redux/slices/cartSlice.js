
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';
// import axios from 'axios';


// const API_URL = 'https://ehub-c95q.onrender.com/api/cart/';
// const API_URL = 'http://localhost:5000/api/cart/';


const initialState = {
    cartItems: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

const getToken = (thunkAPI) => {
  return thunkAPI.getState().auth.user?.token;
};

export const addToCart = createAsyncThunk(
  'cart/add',
  async (itemData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await API.post('/cart', itemData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getCart = createAsyncThunk(
  'cart/getAll',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await API.get('/cart', config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (productId, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await API.delete(`/cart/${productId}`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload.items;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload.items;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload.items;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
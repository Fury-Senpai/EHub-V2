import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resetCart } from './cartSlice';
import API from '../../api/axios';

const initialState = {
  orders: [],
  order: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await API.post('/orders', orderData, config);

      thunkAPI.dispatch(resetCart());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;

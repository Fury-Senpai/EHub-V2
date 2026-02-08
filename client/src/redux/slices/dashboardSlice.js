import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  orders: [],
  totalSales: 0,
  totalRevenue: 0,
  isError: false,
  isLoading: false,
  message: '',
};

const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;

export const getSellerOrders = createAsyncThunk(
  'dashboard/getAllOrders',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await API.get('/orders', config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.totalSales = action.payload.length;
        state.totalRevenue = action.payload.reduce(
          (acc, order) => acc + order.totalAmount,
          0
        );
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;

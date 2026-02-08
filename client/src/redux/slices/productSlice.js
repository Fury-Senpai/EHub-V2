import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  products: [],
  product: {},
  page: 1,
  pages: 1,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;

// GET ALL
export const getProducts = createAsyncThunk(
  'products/getAll',
  async ({ keyword = '', pageNumber = '' }, thunkAPI) => {
    try {
      const response = await API.get(
        `/products?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// GET BY ID
export const getProductById = createAsyncThunk(
  'products/getById',
  async (productId, thunkAPI) => {
    try {
      const response = await API.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// CREATE
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await API.post('/products', productData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// DELETE
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await API.delete(`/products/${id}`, config);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// UPDATE
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await API.put(`/products/${id}`, productData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProducts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;

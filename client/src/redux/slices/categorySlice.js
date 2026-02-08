import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;

// GET ALL
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/categories');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// CREATE
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await API.post('/categories', categoryData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// DELETE
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await API.delete(`/categories/${id}`, config);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategories: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetCategories } = categorySlice.actions;
export default categorySlice.reducer;

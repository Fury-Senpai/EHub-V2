import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  messages: [
    { from: 'bot', text: 'Hello! How can I help you find the perfect product today?' }
  ],
  isOpen: false,
  isLoading: false,
  isError: false,
  message: '',
};

// SEND MESSAGE
export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async (messageData, thunkAPI) => {
    try {
      const response = await API.post('/chatbot/ask', messageData);
      return response.data.reply;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    addUserMessage: (state, action) => {
      state.messages.push({ from: 'user', text: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({ from: 'bot', text: action.payload });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.messages.push({
          from: 'bot',
          text: `Sorry, something went wrong. ${action.payload}`,
        });
      });
  },
});

export const { toggleChat, addUserMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;

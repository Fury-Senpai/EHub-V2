
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = 'https://ehub-c95q.onrender.com/api/chatbot/'; //for render
const API_URL = 'http://localhost:5000/api/chatbot/ask';

const initialState = {
    messages: [{ from: 'bot', text: 'Hello! How can I help you find the perfect product today?' }],
    isOpen: false,
    isLoading: false,
    isError: false,
    message: '',
};
 
// Async thunk to send a message to the backend
export const sendMessage = createAsyncThunk('chatbot/sendMessage', async (messageData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL , messageData); 
        return response.data.reply;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },
        addUserMessage: (state, action) => {
            state.messages.push({ from: 'user', text: action.payload });
        }
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
                state.messages.push({ from: 'bot', text: `Sorry, something went wrong. ${action.payload}` });
            });
    },
});

export const { toggleChat, addUserMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;

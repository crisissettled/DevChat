import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiEndPoints, FetchStatus, RequestMethod } from '../../utils/Constants'
import { httpFetch } from '../../utils/httpFetch'
import { addDataToIdxedDb, addMultiDataItemToIdxedDb } from '../../utils/indexedDB';


export const getUserChatMessage = createAsyncThunk(
    ApiEndPoints.GET_USER_CHAT_MESSAGE,
    async (data, thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.GET_USER_CHAT_MESSAGE, RequestMethod.GET, thunkAPI, data);
        let result = await response.json();
        addMultiDataItemToIdxedDb(result?.data);
   
        const loggedInUser = thunkAPI.getState().user;        

        return { data: result, loggedInUser };
    }
)

export const sendChatMessage = createAsyncThunk(
    ApiEndPoints.SEND_CHAT_MESSAGE,
    async (data, thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.SEND_CHAT_MESSAGE, RequestMethod.POST, thunkAPI, data);
        let result = await response.json();
        addDataToIdxedDb(result?.data);

        return result;
    }
)

const chatMessageSlice = createSlice({
    name: 'chatMessage',
    initialState: {
        status: "idle",
        data: null,
        error: null,
        isDataLoaded: false
    },
    reducers: {
        loadMessage(state, { payload }) {
            const messages = payload.data;
            const loggedInUser = payload.loggedInUser;
            if (state.data === null) state.data = {};

            for (const msgItem of messages) {
                if (msgItem.fromUserId !== loggedInUser.userId) {
                    if (!state.data[msgItem.fromUserId]) state.data[msgItem.fromUserId] = [];
                    state.data[msgItem.fromUserId].push({ user: msgItem.fromUserId, message: msgItem.message });
                } else {
                    if (!state.data[msgItem.toUserId]) state.data[msgItem.toUserId] = [];
                    state.data[msgItem.toUserId].push({ user: msgItem.fromUserId, message: msgItem.message });
                }
            }
        },
        addMessage(state, { payload }) {
            const fromUserId = payload.fromUserId;
            const message = payload.message;

            if (state.data === null) state.data = {};
            if (!state.data[fromUserId]) state.data[fromUserId] = [];

            state.data[fromUserId].push({ user: fromUserId, message });

        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendChatMessage.pending, (state) => {
            state.status = FetchStatus.PENDING

        }).addCase(sendChatMessage.fulfilled, (state, { payload }) => {
            state.status = FetchStatus.FULFILLED
            const data = payload.data;
            const friendUserId = data?.toUserId;
            const message = data?.message;

            if (state.data === null) state.data = {};
            if (!state.data[friendUserId]) state.data[friendUserId] = [];
         
            state.data[friendUserId].push({ user: friendUserId, message });

        }).addCase(sendChatMessage.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        }).addCase(getUserChatMessage.pending, (state) => {
            state.status = FetchStatus.PENDING

        }).addCase(getUserChatMessage.fulfilled, (state, { payload }) => {
            state.status = FetchStatus.FULFILLED
            const messages = payload.data?.data;
            const loggedInUser = payload.loggedInUser;
            if (state.data === null) state.data = {};
           
            for (const msgItem of messages) {
                if (msgItem.fromUserId !== loggedInUser.userId) {
                    if (!state.data[msgItem.fromUserId]) state.data[msgItem.fromUserId] = [];
                    state.data[msgItem.fromUserId].push({ user: msgItem.fromUserId, message: msgItem.message });
                } else {
                    if (!state.data[msgItem.toUserId]) state.data[msgItem.toUserId] = [];
                    state.data[msgItem.toUserId].push({ user: msgItem.fromUserId, message: msgItem.message });
                }
            }

            state.isDataLoaded = true;

        }).addCase(getUserChatMessage.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        })

    },
})

export const { loadMessage, addMessage } = chatMessageSlice.actions

export default chatMessageSlice.reducer
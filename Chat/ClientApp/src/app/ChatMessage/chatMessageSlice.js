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

        const loggedInUser = thunkAPI.getState().user;

        return { data: result, loggedInUser };
    }
)

export const updateChatMessageReadStatus = createAsyncThunk(
    ApiEndPoints.UPDATE_CHAT_MESSAGE_READ_STATUS,
    async (data, thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.UPDATE_CHAT_MESSAGE_READ_STATUS, RequestMethod.PUT, thunkAPI, data);
        let result = await response.json();
        if (result.data) addDataToIdxedDb(result?.data);

        const loggedInUser = thunkAPI.getState().user;

        return { data: result, loggedInUser };
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
                    state.data[msgItem.fromUserId].push({ id: msgItem.id, user: msgItem.fromUserId, message: msgItem.message, sendAt: msgItem.sendAt, isRead: msgItem.isRead, isSent: msgItem.isSent });
                } else {
                    if (!state.data[msgItem.toUserId]) state.data[msgItem.toUserId] = [];
                    state.data[msgItem.toUserId].push({ id: msgItem.id, user: msgItem.fromUserId, message: msgItem.message, sendAt: msgItem.sendAt, isRead: msgItem.isRead, isSent: msgItem.isSent });
                }
            }
        },
        addMessage(state, { payload }) {
            const fromUserId = payload.fromUserId;
            const message = payload.message;
            const sendAt = payload.sendAt;
            const isRead = payload.isRead;
            const isSent = payload.isSent;
            const id = payload.id;

            if (state.data === null) state.data = {};
            if (!state.data[fromUserId]) state.data[fromUserId] = [];

            state.data[fromUserId].push({ id, user: fromUserId, message, sendAt, isRead, isSent });

        },
        updateMessage(state, { payload }) {
            const toUserId = payload.toUserId;

            const id = payload.id;

            if (state.data === null) state.data = {};
            if (!state.data[toUserId]) state.data[toUserId] = [];

            state.data[toUserId]?.forEach(message => {
                if (message.id === id) message.isRead = true;
            });
        }


    },
    extraReducers: (builder) => {
        builder.addCase(sendChatMessage.pending, (state) => {
            state.status = FetchStatus.PENDING

        }).addCase(sendChatMessage.fulfilled, (state, { payload }) => {
            state.status = FetchStatus.FULFILLED
            const data = payload.data.data;
            const friendUserId = data?.toUserId;
            const message = data?.message;
            const id = data?.id;

            const loggedInUser = payload.loggedInUser;

            if (state.data === null) state.data = {};
            if (!state.data[friendUserId]) state.data[friendUserId] = [];

            state.data[friendUserId].push({ id: id, user: loggedInUser.userId, message, sendAt: data.sendAt, isRead: data.isRead, isSent: data.isSent });

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
                    state.data[msgItem.fromUserId].push({ id: msgItem.id, user: msgItem.fromUserId, message: msgItem.message, sendAt: msgItem.sendAt, isRead: msgItem.isRead, isSent: msgItem.isSent });
                } else {
                    if (!state.data[msgItem.toUserId]) state.data[msgItem.toUserId] = [];
                    state.data[msgItem.toUserId].push({ id: msgItem.id, user: msgItem.fromUserId, message: msgItem.message, sendAt: msgItem.sendAt, isRead: msgItem.isRead, isSent: msgItem.isSent });
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
        }).addCase(updateChatMessageReadStatus.pending, (state) => {
            state.status = FetchStatus.PENDING

        }).addCase(updateChatMessageReadStatus.fulfilled, (state, { payload }) => {
            state.status = FetchStatus.FULFILLED
            const message = payload.data?.data;
            if (message) {               
                const loggedInUser = payload.loggedInUser;
                if (state.data === null) state.data = {};

                if (message.fromUserId !== loggedInUser.userId) {
                    if (!state.data[message.fromUserId]) state.data[message.fromUserId] = [];
                    state.data[message.fromUserId]?.forEach(item => {
                        if (message.id === item.id) item.isRead = true;
                    });
                } else {
                    if (!state.data[message.toUserId]) state.data[message.toUserId] = [];              
                    state.data[message.toUserId]?.forEach(item => {
                        if (message.id === item.id) item.isRead = true;
                    });
                }

                state.isDataLoaded = true;
            }

        }).addCase(updateChatMessageReadStatus.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        })

    },
})

export const { loadMessage, addMessage, updateMessage } = chatMessageSlice.actions

export default chatMessageSlice.reducer
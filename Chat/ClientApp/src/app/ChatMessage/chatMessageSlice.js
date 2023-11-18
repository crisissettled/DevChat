import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiEndPoints, FetchStatus } from '../../utils/Constants'
import { httpFetch } from '../../utils/httpFetch'
import { addDataToIdxedDb } from '../../utils/indexedDB';

export const sendChatMessage = createAsyncThunk(
    ApiEndPoints.SEND_CHAT_MESSAGE,
    async (data,thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.SEND_CHAT_MESSAGE, "POST", thunkAPI, data);
        let result = await response.json();
        addDataToIdxedDb(result?.data);
        return result;
    }
) 

const chatMessageSlice = createSlice({
    name: 'chatMessage',
    initialState: {
        status: "idle",
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(sendChatMessage.pending, (state) => {        
            state.status = FetchStatus.PENDING

        }).addCase(sendChatMessage.fulfilled, (state, { payload}) => {            
            state.status = FetchStatus.FULFILLED
            state.data = state.data.concat(payload.data)            

        }).addCase(sendChatMessage.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }

        }) 

    },
})


export default chatMessageSlice.reducer
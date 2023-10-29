import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { ApiEndPoints, FetchStatus } from '../../utils/Constants'
import { httpFetch } from '../../utils/httpFetch';

export const searchUserFriend = createAsyncThunk(
    ApiEndPoints.SEARCH_FRIEND,
    async (SearchKeyword = '',thunkAPI) => {     
        let response = await httpFetch(ApiEndPoints.SEARCH_FRIEND, "PUT", thunkAPI, { SearchKeyword });
        return response.json();
    }
)

const searchFriendSlice = createSlice({
    name: 'searchFriend',
    initialState: {
        status: "idle",
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(searchUserFriend.pending, (state, action) => {
            state.status = FetchStatus.PENDING
        }).addCase(searchUserFriend.fulfilled, (state, { payload }) => {
            state.status = FetchStatus.FULFILLED
            state.data = payload.data
        }).addCase(searchUserFriend.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        })
    },
})


export default searchFriendSlice.reducer
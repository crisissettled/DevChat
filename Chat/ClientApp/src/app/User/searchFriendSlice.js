import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { FETCH_STATUS_PENDING, FETCH_STATUS_FULFILLED, FETCH_STATUS_REJECTED } from '../../utils/Constants'

const searchFriendEndpoint = '/api/User/SearchFriend'

export const searchUserFriend = createAsyncThunk(
    searchFriendEndpoint,
    async (SearchKeyword = '') => {
        let response = await fetch(searchFriendEndpoint, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ SearchKeyword })
        })
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
            state.status = FETCH_STATUS_PENDING
        }).addCase(searchUserFriend.fulfilled, (state, { payload }) => {
            state.status = FETCH_STATUS_FULFILLED
            state.data = payload.data
        }).addCase(searchUserFriend.rejected, (state, action) => {
            state.status = FETCH_STATUS_REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        })
    },
})


export default searchFriendSlice.reducer
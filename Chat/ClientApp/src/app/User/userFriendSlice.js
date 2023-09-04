import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { FETCH_STATUS_PENDING, FETCH_STATUS_FULFILLED, FETCH_STATUS_REJECTED } from '../../utils/Constants'

const userFriendEndpoint = '/api/User/SearchFriend'

export const fetchUserFriend = createAsyncThunk(
    userFriendEndpoint,
    async (SearchKeyword = '') => {
        let response = await fetch(userFriendEndpoint, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ SearchKeyword })
        })
        return response.json();
    }
)

const userFriendSlice = createSlice({
    name: 'users',
    initialState: {
        status: "idle",
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserFriend.pending, (state, action) => {
            state.status = FETCH_STATUS_PENDING
        }).addCase(fetchUserFriend.fulfilled, (state, { payload }) => {
            state.status = FETCH_STATUS_FULFILLED
            state.data = payload.data
        }).addCase(fetchUserFriend.rejected, (state, action) => {
            state.status = FETCH_STATUS_REJECTED
            if (action.payload) {
                // Since we passed in `MyKnownError` to `rejectValue` in `updateUser`, the type information will be available here.
                state.error = action.payload
            } else {
                state.error = action.error
            }
        })
    },
})


export default userFriendSlice.reducer
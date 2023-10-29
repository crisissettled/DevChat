import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiEndPoints, FetchStatus } from '../../utils/Constants'
import { httpFetch } from '../../utils/httpFetch'

export const addUserFriend = createAsyncThunk(
    ApiEndPoints.ADD_USER_FRIEND,
    async (data,thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.ADD_USER_FRIEND, "POST", thunkAPI, data);
        return response.json();
    }
)

export const getUserFriends = createAsyncThunk(
    ApiEndPoints.GET_USER_FRIENDS,
    async ({userId, Blocked = null }, thunkAPI) => {               
        let response = await httpFetch(ApiEndPoints.GET_USER_FRIENDS, "PUT", thunkAPI, { userId, Blocked });
        return response.json();
    }
)

export const acceptOrDenyFriend = createAsyncThunk(
    ApiEndPoints.ACCEPT_OR_DENY_FRIENDS,
    async (data, thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.ACCEPT_OR_DENY_FRIENDS, "PUT", thunkAPI, data);
        return response.json();
    }
)

const userFriendSlice = createSlice({
    name: 'userFriend',
    initialState: {
        status: "idle",
        data: [],
        error: null,
        individualStatus: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addUserFriend.pending, (state, { meta }) => {         
            let userIdAndFriendId = `${meta.arg.userId}_${meta.arg.friendUserId}`;
            state.individualStatus[userIdAndFriendId] = FetchStatus.PENDING
            state.status = FetchStatus.PENDING

        }).addCase(addUserFriend.fulfilled, (state, { payload,meta}) => {
            let userIdAndFriendId = `${meta.arg.userId}_${meta.arg.friendUserId}`;
            state.individualStatus[userIdAndFriendId] = FetchStatus.FULFILLED
            console.log(payload, "getUserFriends.fulfilled")
            state.status = FetchStatus.FULFILLED
            state.data = payload.data

        }).addCase(addUserFriend.rejected, (state, action) => {
            console.log(action, "rejected-action")
            state.status = FetchStatus.REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }

        }).addCase(getUserFriends.pending, (state) => {            
            state.status = FetchStatus.PENDING

        }).addCase(getUserFriends.fulfilled, (state, action) => {           
            state.status = FetchStatus.FULFILLED
            state.data = action.payload.data

        }).addCase(getUserFriends.rejected, (state, action) => {       
            state.status = FetchStatus.REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        }).addCase(acceptOrDenyFriend.pending, (state, { meta }) => {
            let userIdAndFriendId = `${meta.arg.userId}_${meta.arg.friendUserId}`;
            state.individualStatus[userIdAndFriendId] = FetchStatus.PENDING
            state.status = FetchStatus.PENDING

        }).addCase(acceptOrDenyFriend.fulfilled, (state, { payload, meta }) => {
            let userIdAndFriendId = `${meta.arg.userId}_${meta.arg.friendUserId}`;
            state.individualStatus[userIdAndFriendId] = FetchStatus.FULFILLED
            console.log(payload, "acceptOrDenyFriend.fulfilled")
            state.status = FetchStatus.FULFILLED
            state.data = payload.data
        })

    },
})


export default userFriendSlice.reducer
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { FETCH_STATUS_PENDING, FETCH_STATUS_FULFILLED, FETCH_STATUS_REJECTED } from '../../utils/Constants'

const addUserFriendEndpoint = '/api/UserFriend/AddUserFriend'
const getUserFriendsEndpoint = '/api/UserFriend/GetUserFriends'

export const addUserFriend = createAsyncThunk(
    addUserFriendEndpoint,
    async (body) => {
        //console.log(body,"body")
        let response = await fetch(addUserFriendEndpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
        return response.json();
    }
)

export const getUserFriends = createAsyncThunk(
    getUserFriendsEndpoint,
    async (userId) => {    
        let response = await fetch(getUserFriendsEndpoint, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId})
        })
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
            state.individualStatus[userIdAndFriendId] = FETCH_STATUS_PENDING
            state.status = FETCH_STATUS_PENDING
        }).addCase(addUserFriend.fulfilled, (state, { payload,meta}) => {
            let userIdAndFriendId = `${meta.arg.userId}_${meta.arg.friendUserId}`;
            state.individualStatus[userIdAndFriendId] = FETCH_STATUS_FULFILLED
            console.log(payload, "getUserFriends.fulfilled")
            state.status = FETCH_STATUS_FULFILLED
            state.data =  payload.data
        }).addCase(addUserFriend.rejected, (state, action) => {
            console.log(action, "rejected-action")
            state.status = FETCH_STATUS_REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        }).addCase(getUserFriends.pending, (state) => {            
            state.status = FETCH_STATUS_PENDING
        }).addCase(getUserFriends.fulfilled, (state, action) => {           
            state.status = FETCH_STATUS_FULFILLED
            state.data = action.payload.data
        }).addCase(getUserFriends.rejected, (state, action) => {       
            state.status = FETCH_STATUS_REJECTED
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }
        })

    },
})


export default userFriendSlice.reducer
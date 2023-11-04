import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiEndPoints, FetchStatus } from '../../utils/Constants';
import { httpFetch } from '../../utils/httpFetch';

export const userSignIn = createAsyncThunk(
    ApiEndPoints.USER_SIGN_IN,
    async (data, thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.USER_SIGN_IN, "PUT", thunkAPI, data);
        return response.json();
    }
)

export const userSignOut = createAsyncThunk(
    ApiEndPoints.USER_SIGN_CHAT_OUT,
    async (data, thunkAPI) => {
        let response = await httpFetch(ApiEndPoints.USER_SIGN_CHAT_OUT, "PUT", thunkAPI, data);
        return response.json();
    }     
)


export const getUserInfo = createAsyncThunk(
    ApiEndPoints.USER_GET_USER_INFO,
    async (userId, thunkAPI) => {
        let response = await httpFetch(`${ApiEndPoints.USER_GET_USER_INFO}?userId=${userId}`, "GET", thunkAPI);
        return response.json();
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isSignedIn: null,
        token: null,
        userId: null,
        hubConnectionState:"",
        data: null
    },
    reducers: {
        doSignIn: (state, action) => {          
            //console.log(action,"action in Sigin Slice")
            state.isSignedIn = action.payload.signedIn;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
        },
        doSignOut: (state) => {
            state.isSignedIn = false;
            state.token = "";
            state.userId = "";
        },
        updateHubConnectionState(state, { payload }) {
            state.hubConnectionState = payload?.connectionState
        }

    },
    extraReducers: (builder) => {
        builder.addCase(userSignIn.pending, (state) => {
            state.status = FetchStatus.PENDING

        }).addCase(userSignIn.fulfilled, (state, { payload}) => {
            state.status = FetchStatus.FULFILLED
            state.token = payload.data.token
            state.isSignedIn = true
            state.userId = payload.data.userId
        }).addCase(userSignIn.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
            signUserOut(state)
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }

        }).addCase(userSignOut.pending, (state) => {
            state.status = FetchStatus.PENDING

        }).addCase(userSignOut.fulfilled, (state, { payload}) => {
            state.status = FetchStatus.FULFILLED
            signUserOut(state)

        }).addCase(userSignOut.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
            state.token = ""
            state.isSignedIn = false
            state.userId = ""
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }

        }).addCase(getUserInfo.pending, (state) => {
            state.status = FetchStatus.PENDING

        }).addCase(getUserInfo.fulfilled, (state, { payload}) => {
            state.status = FetchStatus.FULFILLED            
            state.data = payload?.data

        }).addCase(getUserInfo.rejected, (state, action) => {
            state.status = FetchStatus.REJECTED
         
            if (action.payload) {
                state.error = action.payload
            } else {
                state.error = action.error
            }

        })
    }
})

const signUserOut = (state) => {
    state.isSignedIn = false;
    state.token = "";
    state.userId = "";
}

// Action creators are generated for each case reducer function
export const { doSignIn, doSignOut, updateHubConnectionState } = userSlice.actions

export default userSlice.reducer
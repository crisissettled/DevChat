import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isSignedIn: false,
        token: ""
    },
    reducers: {
        doSignIn: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.

            //console.log(action,"action in Sigin Slice")
            state.isSignedIn = action.payload.signedIn;
            state.token = action.payload.token;
        },
        doSignOut: (state) => {
            state.isSignedIn = false;
            state.token = "";
        }
    },
})

// Action creators are generated for each case reducer function
export const { doSignIn, doSignOut } = userSlice.actions

export default userSlice.reducer
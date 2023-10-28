import { configureStore } from '@reduxjs/toolkit'

import userReducer from './User/userSlice'
import searchFriendReducer from './User/searchFriendSlice'
import userFriendReducer from './UserFriend/userFriendSlice'
//import { userFriendApi } from "./api/userFriendApi";

//import { doSignIn } from '../app/User/userSlice'

export default configureStore({
    reducer: {
        user: userReducer,
        searchFriend: searchFriendReducer,
        userFriend: userFriendReducer
    },
    //middleware: (getDefaultMiddleware) =>
    //    getDefaultMiddleware().concat(refreshToken),
})


function refreshToken({ getState,dispatch }) {
    return next => action => {
        //console.log('will dispatch', action)

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action)
        console.log("action -----> ", action)
        console.log("returnValue -----> ", returnValue)
        console.log("getState -----> ", getState().user.userId)
        if (returnValue?.meta?.requestStatus === "fulfilled" && action.type !== "user/doSignIn") {
            var newToken = returnValue?.meta?.arg?.token;
            if (newToken) {
                dispatch(doSignIn({ signedIn: true, token: newToken, userId: getState().user.userId }));
            }
             
        }
        //console.log('state after dispatch - getstate', getState())
        //console.log('state after dispatch', returnValue)
        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue
    }
}
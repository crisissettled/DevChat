import { configureStore } from '@reduxjs/toolkit'

import userReducer from './User/userSlice'
import userFriendReducer from './User/userFriendSlice'
//import { userFriendApi } from "./api/userFriendApi";

export default configureStore({
    reducer: {
        user: userReducer,
        userFriend: userFriendReducer
    },
    //middleware: (getDefaultMiddleware) =>
    //    getDefaultMiddleware().concat(userFriendApi.middleware),
})
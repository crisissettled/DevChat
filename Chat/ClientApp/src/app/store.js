import { configureStore } from '@reduxjs/toolkit'

import userReducer from './User/userSlice'
import searchFriendReducer from './User/searchFriendSlice'
import userFriendReducer from './UserFriend/userFriendSlice'
//import { userFriendApi } from "./api/userFriendApi";

export default configureStore({
    reducer: {
        user: userReducer,
        searchFriend: searchFriendReducer,
        userFriend: userFriendReducer
    },
    //middleware: (getDefaultMiddleware) =>
    //    getDefaultMiddleware().concat(userFriendApi.middleware),
})
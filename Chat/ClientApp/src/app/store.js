import { configureStore } from '@reduxjs/toolkit'

import signInReducer from './SignIn/signInSlice'

export default configureStore({
    reducer: {
        signin: signInReducer
    },
})
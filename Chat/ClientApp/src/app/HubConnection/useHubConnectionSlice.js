import { createSlice } from '@reduxjs/toolkit'

const hubConnectionSlice = createSlice({
    name: 'hubConnection',
    initialState: {
        status: "idle",
        data: null,
        error: null     
    },
    reducers: {
        setupHubConnection: (state, { payload: { hubConnection} }) => {           
            state.data = hubConnection;         
        }
    }
});

export const { setupHubConnection } = hubConnectionSlice.actions

export default hubConnectionSlice.reducer

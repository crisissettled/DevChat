import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from "react-router-dom";
import { doSignIn } from '../app/User/userSlice';

export function PrivateRoute({ children, redirectPath = '/signin' }) {
    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [refreshStage, setRefreshStage] = useState(0) //0: init, 1:refresh request in progress, 2:refresh finshed

    async function Refresh() {
        setRefreshStage(1)
        let response = await fetch('/api/User/RefreshSignIn', {
            method: "PUT",
            credentials: "same-origin"
        })

        if (response.status !== 401) {
            var signInState = await response.json();
            dispatch(doSignIn({ signedIn: true, token: signInState?.data, userId: signInState?.data.userId }))    
            setRefreshStage(0)
        }
        setRefreshStage(2)
    }
    //console.log(userState.isSignedIn, refreshStage,"userState.isSignedIn,refreshStage")

    if (userState.isSignedIn === false) {
        if (refreshStage === 1) return;
        if (refreshStage === 0) Refresh();        
        return <Navigate to={redirectPath} replace />;
    }  

    return children;
};
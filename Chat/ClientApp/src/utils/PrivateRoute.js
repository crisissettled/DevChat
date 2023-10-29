import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from "react-router-dom";
import { refreshToken } from './httpFetch';
import { doSignIn } from '../app/User/userSlice';


export function PrivateRoute({ children, redirectPath = '/signin' }) {
    const [pageReloadStage, setPageReloadStage] = useState(0) //0: init, 1:refresh request in progress, 2:refresh finshed and need to re-login
    const loggedInUser = useSelector((state) => state.user)
    const dispatch = useDispatch();

    let isPageReload = loggedInUser.isSignedIn === null && loggedInUser.token === null && loggedInUser.userId === null
    async function doRefreshToken() {        
        if (isPageReload === true) { 
            setPageReloadStage(1)
            //get token and setup login state upon refresh page
            const response = await refreshToken();
            if (response.ok) {
                let result = await response.json()
                let token = result?.data?.token
                let userId = result?.data.userId
                dispatch(doSignIn({ signedIn: true, token, userId }))
                setPageReloadStage(0)
            }
            setPageReloadStage(2)
        } 
    }

    if (isPageReload === true) {
        switch (pageReloadStage) {
            case 0:
                doRefreshToken();
                break;
            case 1:
                return;
            default:
                return <Navigate to={redirectPath} replace />;
        }        
    } 

    return loggedInUser.isSignedIn === true ? children : <Navigate to={redirectPath} replace /> 
};
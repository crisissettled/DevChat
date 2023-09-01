import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children, redirectPath = '/signin' }) {
    const userState = useSelector((state) => state.user)
 
    if (userState.isSignedIn === false) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};
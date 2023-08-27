import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children, redirectPath = '/signin' }) {
    const signInState = useSelector((state) => state.signin)
 
    if (signInState.isSignedIn === false) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};
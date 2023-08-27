import { Chat } from "./pages/Chat";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound"

import { PrivateRoute } from './utils/PrivateRoute'

const AppRoutes = [
    {
        index: true,
        element: <PrivateRoute><Chat /></PrivateRoute>
    },  
    {
        path: '/chat',
        element: <PrivateRoute><Chat /></PrivateRoute>
    }, 
    {
        path: '/signin',
        element: <SignIn />
    },
    {
        path: '/signup',
        element: <SignUp />
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;

import { Chat } from "./pages/Chat";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound"

import { PrivateRoute } from './utils/PrivateRoute'
import { Layout } from "./layout/Layout";

const AppRoutes = [
    {
        index: true,
        element: <Layout><PrivateRoute><Chat /></PrivateRoute></Layout>
    },  
    {
        path: '/chat',
        element: <Layout><PrivateRoute><Chat /></PrivateRoute></Layout>
    }, 
    {
        path: '/signin',
        element: <SignIn />
    },
    {
        path: '/signup',
        element: <Layout><SignUp /></Layout>
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;

import { Chat, SignIn, SignUp, NotFound, Profile, SignOut, FindFriend } from "./pages";
import { PrivateRoute } from './utils/PrivateRoute'
import { Layout,LayoutChat } from "./layout";

const AppRoutes = [
    {
        index: true,
        element: <LayoutChat><PrivateRoute><Chat /></PrivateRoute></LayoutChat>
    },  
    {
        path: '/chat',
        element: <LayoutChat><PrivateRoute><Chat /></PrivateRoute></LayoutChat>
    }, 
    {
        path: '/findfriend',
        element: <LayoutChat><PrivateRoute><FindFriend /></PrivateRoute></LayoutChat>
    },
    {
        path: '/profile',
        element: <LayoutChat><PrivateRoute><Profile /></PrivateRoute></LayoutChat>
    }, 
    {
        path: '/signup',
        element: <Layout><SignUp /></Layout>
    },
    {
        path: '/signin',
        element: <SignIn />
    },
    {
        path: '/signout',
        element: <PrivateRoute><SignOut /></PrivateRoute>
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;

import { Chat } from "./pages/Chat";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound"

const AppRoutes = [
    {
        index: true,
        element: <Chat />
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

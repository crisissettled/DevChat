import { Chat } from "./pages/Chat";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound"

const AppRoutes = [
    {
        index: true,
        element: <Chat />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;

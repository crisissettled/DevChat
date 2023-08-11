
import { Home } from "./components/Home";
import { Counter } from "./components/Counter";
import { Chat } from "./components/Chat";
import { NotFound } from "./components/NotFound"

const AppRoutes = [
    {
        index: true,
        element: <Chat />
    },
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '/counter',
        element: <Counter />
    },
    {
        path: '*',
        element: <NotFound />
    }
];

export default AppRoutes;

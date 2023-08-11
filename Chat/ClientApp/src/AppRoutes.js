import { Counter } from "./components/Counter";

import { Home } from "./components/Home";
import Chat from "./components/Chat";

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
    }
];

export default AppRoutes;

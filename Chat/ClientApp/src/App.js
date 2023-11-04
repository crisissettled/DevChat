import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import './custom.css';

import HubConnectionContext from './utils/hubConnectionContext'
import { useState } from 'react';

export default function App() {
    const [hubConnection, setHubConnection] = useState(null);

    return (
        <HubConnectionContext.Provider value={{ hubConnection, setHubConnection }}>
        <Routes>
            {AppRoutes.map((route, index) => {
                const { element, ...rest } = route;
                return <Route key={index} {...rest} element={element} />;
            })}
            </Routes>
        </HubConnectionContext.Provider>
    );
}

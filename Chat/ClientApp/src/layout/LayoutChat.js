import React from 'react';
import { Container } from 'reactstrap';
import { NavMenuChat } from '../components/nav/NavMenuChat'

export function LayoutChat({ children}) {
    return (
        <div>
            <NavMenuChat />
            <Container tag="main">
                {children}
            </Container>
        </div>
    );
} 

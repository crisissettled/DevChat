import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from '../components/nav/NavMenu';

export function Layout({ children}) {
    return (
        <div>
            <NavMenu />
            <Container tag="main">
                {children}
            </Container>
        </div>
    );
} 

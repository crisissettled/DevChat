import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { HubConnectionState } from '@microsoft/signalr';
import './NavMenu.css';
import { GoCheckCircleFill } from 'react-icons/go'

import { Logo } from '../logo/Logo'

export function NavMenuChat() {
    const user = useSelector(state => state.user)

    const location = useLocation();

    const getClassName = (path) => {
        return location.pathname === path || (path === "/" && location.pathname === "/chat") ? "text-dark border-bottom border-info border-2" : "text-dark";
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                <span className="me-2"><Logo width={50} height={30} fontSzie={"fs-6"} /></span>
                <NavbarBrand tag={Link} to="/"> Welcome
                    <span className="text-capitalize mx-2">
                        {!user.data?.name ? user.userId : user.data?.name}
                    </span>
                    {
                        !!user?.hubConnectionState &&
                        (
                            <span>
                                {(user?.hubConnectionState === HubConnectionState.Connecting || user?.hubConnectionState === HubConnectionState.Reconnecting) && "Connecting..."}
                                {user?.hubConnectionState === HubConnectionState.Connected && <span title="online"><GoCheckCircleFill style={{ color: 'green', fontSize: '15' }} /> </span>}
                                {user?.hubConnectionState === HubConnectionState.Disconnected && <span title="offline"><GoCheckCircleFill /></span>}
                            </span>
                        )
                    }
                </NavbarBrand>

                {/*  <NavbarToggler  className="mr-2" />*/}
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" navbar>
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className={getClassName("/")} to="/" >Chat</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className={getClassName("/findfriend")} to="/findfriend">Find Friend</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className={getClassName("/profile")} to="/profile">Profile</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className={getClassName("/signout")} to="/signout">Sign Out</NavLink>
                        </NavItem>
                        <NavItem>
                            <a href="/swagger" target="_blank">swagger</a>
                        </NavItem>
                    </ul>
                </Collapse>
            </Navbar>
        </header >
    )

}
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export function NavMenuChat() {
    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                <NavbarBrand tag={Link} to="/">Dev Chat</NavbarBrand>
              {/*  <NavbarToggler  className="mr-2" />*/}
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" navbar>
                    <ul className="navbar-nav flex-grow">

                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">Chat</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/profile">Profile</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/signout">Sign Out</NavLink>
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
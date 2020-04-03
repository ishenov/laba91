import React from 'react';
import {NavLink as RouterNavLink} from 'react-router-dom';
import {Nav, Navbar, NavbarBrand} from 'reactstrap';
import {useDispatch, useSelector} from "react-redux";
import UserMenu from "./UserMenu";
import AnonymousMenu from "./AnonymousMenu";
import {logoutUser} from "../../../store/actions/usersActions";

const Toolbar = () => {
  const user = useSelector(state => state.users.user);
  const dispatch = useDispatch();

  return (
    <Navbar color="info" dark expand="md">
      <NavbarBrand tag={RouterNavLink} to="/">Chat</NavbarBrand>
      <Nav className="ml-auto" navbar>
        {user ? (
          <UserMenu user={user} logout={() => dispatch(logoutUser())}/>
        ) : (
          <AnonymousMenu/>
        )}
      </Nav>
    </Navbar>
  );
};

export default Toolbar;
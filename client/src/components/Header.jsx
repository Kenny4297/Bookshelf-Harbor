import cookie from "js-cookie"
import React from 'react'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useContext, useState} from 'react'
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const [user, setUser] = useContext(UserContext);

  const logout = () => {
    cookie.remove("auth-token")
    window.location.href = "/login"
  }

  return (
    <header>
      <Navbar bg="dark" expand="md" className="d-flex justify-content-center align-items-center">
        <Navbar.Brand href="/" style={{paddingRight: '15vw', paddingLeft:'20px'}}>
          <h2>Bookshelf Harbor</h2>
        </Navbar.Brand>
        <Form inline="true">
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl type="text" placeholder="Search" style={{width: '35vw'}}className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </div>
        </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto justify-content-end" style={{
            display: "flex",
            justifyContent: "center",
            flexGrow: "1",
          }}>
            <Nav.Link href="/" style={{ color: 'white' }}>Home</Nav.Link>
            {!user ? (
              <>
                <Nav.Link href="/signup" style={{ color: 'white' }}>Signup</Nav.Link>
                <Nav.Link href="/login" style={{ color: 'white' }}>Login</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href={`/profile/${user._id}`} style={{ color: 'white' }}>Profile</Nav.Link>
                <Nav.Link href="##" onClick={logout} style={{ color: 'white' }}>
                  Logout
                </Nav.Link>
                {!user.profileImage ? (
                  <Nav.Link href="/profileImage" style={{ color: 'white' }}>Add a profile Image!</Nav.Link>
                ) : (
                  <NavDropdown
                    title={
                      <img
                        src={user.profileImage}
                        alt="The users profile pic"
                        style={{ width: '40px', borderRadius: '20px' }}
                      />
                    }
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.Item href={`/profile/${user._id}`}>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href="##" onClick={logout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>

  );
}


export default Header
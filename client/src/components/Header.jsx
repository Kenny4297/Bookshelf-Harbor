import cookie from "js-cookie"
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const [user, setUser] = useContext(UserContext);

  const logout = () => {
    cookie.remove("auth-token")
    window.location.href = "/login"
  }

    // This useEffect is used for debugging purposes. It only runs when the component is mounted (the first time it is rendered) and if the user variable changes. 
    useEffect(() => {
        console.log(user);
    }, [user]);

    //Here we are keeping track of the data in the search bar. If it changes, the state will be updated
    const [searchTerm, setSearchTerm] = useState('');

    //Here we are keeping track of the book data. Once the book changes, the state is the updated. 
    const [bookData, setBookData] = useState([]);
  
    const handleInputChange = event => {
        console.log(searchTerm)
        setSearchTerm(event.target.value);
    };
  
    const handleFormSubmit = event => {
        event.preventDefault();
        const query = searchTerm.replace(/ /g, '+');
        const url = `https://openlibrary.org/search.json?title=${query}`;
        fetch(url)
            .then(response => response.json())
            
            //This saves the data as bookData, and we use this variable to map through it later on
            .then(data => setBookData(data.docs));
        setSearchTerm('');
    };


  return (
    <header>
      <Navbar bg="dark" expand="md" className="d-flex justify-content-center align-items-center">
        <Navbar.Brand href="/" style={{paddingRight: '15vw', paddingLeft:'20px'}}>
          <h2>Bookshelf Harbor</h2>
        </Navbar.Brand>
        <Form inline={true} onSubmit={handleFormSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl type="text" placeholder="Search" style={{ width: '35vw' }} className="mr-sm-2" onChange={handleInputChange} />
            <Button variant="outline-success" type="submit">Search</Button>
          </div>
        </Form>

        {/* <form onSubmit={handleFormSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
              <input type="text" value={searchTerm} style={{color: 'black'}} onChange={handleInputChange} />
              <button type="submit">Search</button>
          </div>
        </form> */}



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
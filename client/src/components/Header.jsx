import cookie from "js-cookie"
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from "../contexts/UserContext";

const Header = () => {
  const [user, setUser] = useContext(UserContext);

    // Update on profileImage change
    useEffect(() => {
      if (user && user.profileImage) {
        console.log('User Profile Image changed', user.profileImage);
        // Any additional logic on profileImage change can be written here
      }
    }, [user && user.profileImage]);
    

  const logout = () => {
    cookie.remove("auth-token")
    window.location.href = "/login"
  }

    //Here we are keeping track of the data in the search bar. If it changes, the state will be updated
    const [searchTerm, setSearchTerm] = useState('');

    //Here we are keeping track of the book data. Once the book changes, the state is the updated. 
    const [bookData, setBookData] = useState([]);

    const navigate = useNavigate();
  
    const handleInputChange = event => {
      console.log(event.target.value);
      setSearchTerm(event.target.value);
    };


    // Search bar in Header logic
    const handleFormSubmit = event => {
      event.preventDefault();
      const query = searchTerm.replace(/ /g, '+');
      const url = `https://openlibrary.org/search.json?title=${query}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setBookData(data.docs);
          navigate(`/individual-book/${query}`, { state: { searchTerm: searchTerm.replace(/[+,]/g, '') } });
        });
    };

  return (
    <header style={{width: '100%'}}>
      <Navbar bg="dark" expand="md"className="d-flex justify-content-center align-items-center">
        <Navbar.Brand href="/">
          <h2 style={{marginLeft:'2rem'}} >Bookshelf Harbor</h2>
        </Navbar.Brand>

        <Form inline='true' onSubmit={handleFormSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl type="text" placeholder="Search" style={{width:'30vw'}} className="mr-sm-2" onChange={handleInputChange} />

            <Link to={`/individual-book/${searchTerm}`}></Link>

            <Button variant="outline-success" type="submit">Search</Button>
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
                <Nav.Link href={`/shoppingCart/${user._id}`} style={{ color: 'white' }}>Shopping Cart</Nav.Link>
                {user && user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt="The user's profile pic"
                    style={{ width: '40px', borderRadius: '20px' }}
                  />
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
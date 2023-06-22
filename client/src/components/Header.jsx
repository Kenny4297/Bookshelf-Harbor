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
      localStorage.removeItem("auth-token");
      setUser(null); 
      navigate("/login");
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
    <header style={{width: '100%', minHight:'1.5rem', maxHeight:'1.5rem'}}>
      <Navbar style={{backgroundColor: "var(--grey-wood)"}} expand="md"className="d-flex justify-content-center align-items-center">
        <Navbar.Brand href="/">
          <h2 style={{marginLeft:'2rem'}} >Nile</h2>
        </Navbar.Brand>

        <Form inline='true' onSubmit={handleFormSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FormControl type="text" placeholder="Search for a book" style={{width:'30vw'}} className="mr-sm-2" onChange={handleInputChange} />

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
            <Nav.Link href="/" >Home</Nav.Link>
            {!user ? (
              <>
                <Nav.Link href="/signup" >Signup</Nav.Link>
                <Nav.Link href="/login" >Login</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href={`/profile/${user._id}`} >Profile</Nav.Link>
                <Nav.Link href="##" onClick={logout} >
                  Logout
                </Nav.Link>
                <Nav.Link href={`/shoppingCart/${user._id}`} >Shopping Cart</Nav.Link>
                {user && user.profileImage && (
                  <img
                    src={user.profileImage}
                    alt="The user's profile pic"
                    style={{ width: '40px', borderRadius: '20px', border:'1px solid var(--dark-wood)'}}
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
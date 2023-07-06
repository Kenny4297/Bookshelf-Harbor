import { Link, useNavigate } from "react-router-dom";
import {
    Navbar,
    Nav,
    FormControl,
    Form
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useState} from "react";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);

    const logout = () => {
        localStorage.removeItem("auth-token");
        setUser(null);
        navigate("/");
    };

    //Here we are keeping track of the data in the search bar. If it changes, the state will be updated
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const query = searchTerm.replace(/ /g, "+");
        navigate(`/individual-book/${query}`, {
            state: { searchTerm: searchTerm.replace(/[+,]/g, "") },
        });
    };

    const navigateTo = (path) => {
        if(user) {
          navigate(path);
        } else {
          navigate("/login", { state: { from: path } });
        }
    };

    return (
        <header
            style={{ width: "100%", minHight: "1.5rem", maxHeight: "1.5rem" }}
            aria-label="Main navigation"
        >
            <Navbar
                style={{ backgroundColor: "var(--grey-wood)" }}
                expand="md"
                className="d-flex justify-content-center align-items-center"
                aria-label="Main menu"
            >
                <Navbar.Brand href="/">
                    <h2 style={{paddingLeft:'2rem'}}>Nile</h2>
                </Navbar.Brand>

                <Form
                    inline="true"
                    onSubmit={handleFormSubmit}
                    aria-label="Search for a book"
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <FormControl
                            type="text"
                            placeholder="Search..."
                            style={{ width: "30vw" }}
                            className="mr-sm-2 header-search-bar"
                            onChange={handleInputChange}
                            aria-label="Search input"
                        />

                        <Link to={`/individual-book/${searchTerm}`}></Link>

                        <button
                            className="header-search-button"
                            aria-label="Search button"
                            type="submit"
                        >
                            Search
                        </button>
                    </div>
                </Form>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        className="ml-auto justify-content-end"
                        style={{
                        display: "flex",
                        justifyContent: "center",
                        flexGrow: "1",
                        }}
                        aria-label="Page navigation"
                    >
                        <Nav.Link className="header-links" onClick={() => navigate("/")}>Home</Nav.Link>

                        <Nav.Link 
                            className="header-links" 
                            onClick={() => navigateTo(`/profile/${user?._id}`)}
                        >
                            Profile
                        </Nav.Link>

                        <Nav.Link 
                            className="header-links" 
                            onClick={() => navigateTo(`/checkout/${user?._id}`)}
                        >
                            Checkout
                        </Nav.Link>

                        <Nav.Link 
                            className="header-links" 
                            onClick={() => navigateTo(`/shoppingCart/${user?._id}`)}
                        >
                            Shopping Cart
                        </Nav.Link>

                        {user ? (
                            <>
                                <Nav.Link
                                    onClick={logout}
                                    aria-label="Logout"
                                    className="header-links"
                                >
                                    Logout
                                </Nav.Link>
                                {user.profileImage && (
                                <img
                                    src={user.profileImage}
                                    alt="The user's profile pic"
                                    style={{
                                    width: "40px",
                                    borderRadius: "20px",
                                    border: "1px solid var(--dark-wood)",
                                    marginRight: "2rem",
                                    }}
                                    className="profile-pic"
                                />
                                )}
                            </>
                        ) : (
                            <>
                                <Nav.Link className="header-links" onClick={() => navigate("/signUp")}>
                                    Sign up
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate("/login")}>
                                    Login
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>


            </Navbar>
        </header>
    );
};

export default Header;

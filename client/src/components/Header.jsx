
import { Link } from "react-router-dom";
import {
    Navbar,
    Nav,
    FormControl,
    Form
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState} from "react";
import { UserContext } from "../contexts/UserContext";

const Header = () => {
    const [user, setUser] = useContext(UserContext);

    const logout = () => {
        localStorage.removeItem("auth-token");
        setUser(null);
        navigate("/login");
    };

    //Here we are keeping track of the data in the search bar. If it changes, the state will be updated
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

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
                        <Nav.Link className="header-links" href="/">Home</Nav.Link>
                        {!user ? (
                            <>
                                <Nav.Link className="header-links" href="/signUp">SignUp</Nav.Link>
                                <Nav.Link href="/login">Login</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link className="header-links" href={`/profile/${user._id}`}>
                                    Profile
                                </Nav.Link>
                                <Nav.Link
                                    href="##"
                                    onClick={logout}
                                    aria-label="Logout"
                                    className="header-links"
                                >
                                    Logout
                                </Nav.Link>
                                <Nav.Link className="header-links" href={`/shoppingCart/${user._id}`}>
                                    Shopping Cart
                                </Nav.Link>
                                {user && user.profileImage && (
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
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
};

export default Header;

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import image from "../assets/images/login.jpg";
import Loading from "../Loading";
import axios from 'axios';

const LoginPage = () => {
    const defForm = { email: "", password: "" };
    const [formData, setFormData] = useState(defForm);
    const [loginResult, setLoginResult] = useState("");
    const navigate = useNavigate();
    // I am not using the 'user' variable, so we deconstruct it (which leaves it out)
    const {1: setUser} = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    // Making sure that the Image loads first, and then the content
    useEffect(() => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            setIsLoading(false);    
        };  
        img.onerror = (error) => console.error("Failed to load image", error);
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const result = await axios.post("/api/user/auth", formData);

            if (result && result.data && !result.data.err && result.data.data && result.data.data.token) {
                setLoginResult("success");
                localStorage.setItem("auth-token", result.data.data.token);
                setUser(result.data.data.user);
                navigate("/");
            } else {
                setLoginResult("fail");
            }
        } catch (error) {
            console.error("Failed to login", error);
        }
    };

    const handleFormSubmitSignUp = (event) => {
        event.preventDefault();

        navigate("/signUp");
    };

    if (isLoading) {
        return <Loading />;
    } else {
        return (
            <section
                className="full-page-background"
                aria-label="Login section"
            >
                <form
                    className="login-form-container"
                    aria-label="User login form"
                >
                    <section
                        className="form-background"
                        aria-label="Login form content"
                    >
                        <h2 className="welcome-to-nile">Welcome to Nile</h2>
                        <h3 className="login-h3">Login</h3>

                        <section
                            className="login-forms"
                            aria-labelledby="email-label"
                        >
                            <label className="label-title" id="email-label">
                                Email Address
                            </label>
                            <input
								id="email"
                                type="text"
                                name="email"
                                placeholder="john@gmail.com"
                                className="form-control"
                                value={formData.email}
                                onChange={handleInputChange}
                                aria-label="Email input field"
                            />
                        </section>

                        <section
                            className="login-forms"
                            aria-labelledby="password-label"
                        >
                            <label className="label-title" id="password-label">
                                Password
                            </label>
                            <input
								id="password"
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleInputChange}
                                aria-label="Password input field"
                            />
                        </section>

                        <div className="form-group mt-2">
                            <button
                                className="sign-up-buttons"
                                onClick={handleFormSubmit}
                                aria-label="Login button"
                            >
                                Log Me In!
                            </button>
                        </div>

                        <nav className="login-sign-up-section">
                            <p>Not a user? Sign up!</p>
                            <div className="form-group mt-2">
                                <button
                                    className="sign-up-buttons"
                                    onClick={handleFormSubmitSignUp}
                                    aria-label="Sign up button"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </nav>
                    </section>
                </form>

                {loginResult === "success" && (
                    <div
                        className="alert alert-success"
                        role="alert"
                        aria-live="polite"
                    >
                        Login successful!
                    </div>
                )}

                {loginResult === "fail" && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                        aria-live="polite"
                    >
                        Login failed!
                    </div>
                )}
            </section>
        );
    }
};

export default LoginPage;
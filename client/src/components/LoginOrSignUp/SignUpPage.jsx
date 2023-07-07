import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import image from "../assets/images/background-sign-up.jpg";
import Loading from "../Loading";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";

const SignUpPage = () => {
    const defForm = { name: "", email: "", password: "" };
    const [formData, setFormData] = useState(defForm);
    const [signUpResult, setSignUpResult] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [emailExists, setEmailExists] = useState('');
    const [nameError, setNameError] = useState('');
    const location = useLocation();
    const [user, setUser] = useContext(UserContext);

    const handleInputChange = (event) => {
        const newFormData = { ...formData, [event.target.name]: event.target.value };
        setFormData(newFormData);
    };

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
    
        setEmailExists("");
        setNameError("");
    
        if (formData.name.trim() === "") {
            setNameError("Please input a name to sign up!");
            return; 
        }
    
        if (formData.email.trim() === "" || formData.password.trim() === "") {
            setEmailExists("Please make sure to fill in all fields!");
            return; 
        }
    
        try {
            const result = await axios.post("/api/user", formData);
    
            if (result.status === 200) {
                const data = result.data;
    
                if (data && !data.err && data.data && data.data.token) {
                    setSignUpResult("success");
                    localStorage.setItem("auth-token", data.data.token);
                    setUser(data.data.user); // Update the user context
                    navigate(location.state?.from || '/'); // Use location state here
                } else {
                    setSignUpResult("fail");
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setSignUpResult("duplicate");
                setEmailExists("Sorry, but a user already exists with this email!");
            } else {
                setSignUpResult("fail");
                if(error.response){
                    if(error.response.status !== 400){
                        console.error(error);
                    }
                }else{
                    console.error(error);
                }
            }
        }
    };
    
    const handleFormSubmitLogin = (event) => {
        event.preventDefault();

        navigate("/login", { state: { from: location.state?.from } });
    };

    if (isLoading) {
        return <Loading />;
    } else {
        return (
            <div style={{border: '2px solid green'}}>
                <section className="sign-up-container">
                    <form className="sign-up-form" onSubmit={handleFormSubmit}>
                        <section className="sign-up-form-background">
                            <h2 className="sign-up-page-title">Sign Up</h2>

                            <section className="sign-up-forms">
                                <label
                                    className="sign-up-label-title"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    minLength={1}
                                    
                                />
                            </section>

                            <section className="sign-up-forms">
                                <label
                                    className="sign-up-label-title"
                                    htmlFor="email"
                                >
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
                                    required
                                />
                            </section>

                            <section className="sign-up-forms">
                                <label
                                    className="sign-up-label-title"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength={1}
                                />
                            </section>

                            {emailExists && <p className="sign-up-duplicate-message">{emailExists}</p>}
                            {nameError && <p className="sign-up-name-error-message">{nameError}</p>}

                            <div className="form-group mt-2 sign-up-duplicate-message-section">
                                <button
                                    type="submit"
                                    className="sign-up-buttons"
                                >
                                    Sign Me Up!
                                </button>
                            </div>

                            <div className="form-group mt-2">
                                <button
                                    type="button"
                                    className="sign-up-buttons"
                                    onClick={handleFormSubmitLogin}
                                >
                                    Go to Login
                                </button>
                            </div>

                            <button
                                className="sign-up-buttons"
                                onClick={() => navigate('/')}
                                aria-label="Home button"
                                style={{marginTop:'.5rem'}}
                            >
                                Home
                            </button>
                        </section>

                    </form>

                    {signUpResult === "success" && (
                        <div className="alert alert-success" role="alert">
                            SignUp successful!
                            {(window.location.href = "/")}
                        </div>
                    )}

                    {signUpResult === "duplicate" && (
                        <div className="alert alert-warning" role="alert">
                            User with this email already exists!
                        </div>
                    )}

                    {signUpResult === "fail" && (
                        <div className="alert alert-danger" role="alert">
                            SignUp failed!
                        </div>
                    )}

                    {signUpResult === "noName" && (
                        <div className="alert alert-warning" role="alert">
                            Please input a name to sign up!
                        </div>
                    )}
                </section>
            </div>
        );
    }
};

export default SignUpPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "../components/assets/images/signup.jpg";
import Loading from "../components/Loading";

const SignupPage = (props) => {
    const defForm = { name: "", email: "", password: "" };
    const [formData, setFormData] = useState(defForm);
    const [signupResult, setSignupResult] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Added this line

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            setIsLoading(false); // Image loaded, set loading state to false
        }; // Image loaded
        img.onerror = (error) => console.error("Failed to load image", error);
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const query = await fetch("/api/user", {
            method: "post",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!query.ok) {
            setSignupResult("fail");
        } else {
            const result = await query.json();
            if (result && !result.err && result.data && result.data.token) {
                setSignupResult("success");
                localStorage.setItem("auth-token", result.data.token); // Set token to local storage
            } else {
                setSignupResult("fail");
            }
        }
    };

    const handleFormSubmitLogin = (event) => {
        event.preventDefault();

        navigate("/login");
    };

    if (isLoading) {
        return <Loading />;
    } else {
        return (
            <>
                <section className="sign-up-container">
                    <form className="signup-form">
                        <section className="signup-form-background">
                            <h2 className="signup-page-title">Sign Up</h2>

                            <section className="signup-forms">
                                <label
                                    className="signup-label-title"
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
                                />
                            </section>

                            <section className="signup-forms">
                                <label
                                    className="signup-label-title"
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
                                />
                            </section>

                            <section className="signup-forms">
                                <label
                                    className="signup-label-title"
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
                                />
                            </section>

                            <div className="form-group mt-2">
                                <button
                                    className="signup-buttons"
                                    onClick={handleFormSubmit}
                                >
                                    Sign Me Up!
                                </button>
                            </div>

                            <div className="form-group mt-2">
                                <button
                                    className="signup-buttons"
                                    onClick={handleFormSubmitLogin}
                                >
                                    Login
                                </button>
                            </div>
                        </section>
                    </form>

                    {signupResult === "success" && (
                        <div className="alert alert-success" role="alert">
                            Signup successful!
                            {(window.location.href = "/")}
                        </div>
                    )}

                    {signupResult === "fail" && (
                        <div className="alert alert-danger" role="alert">
                            Signup failed!
                        </div>
                    )}
                </section>
            </>
        );
    }
};

export default SignupPage;

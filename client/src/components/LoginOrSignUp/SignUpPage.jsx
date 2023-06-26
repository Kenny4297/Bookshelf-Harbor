import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/images/background-sign-up.jpg";
import Loading from "../Loading";
import axios from "axios";

const SignUpPage = () => {
    const defForm = { name: "", email: "", password: "" };
    const [formData, setFormData] = useState(defForm);
    const [signUpResult, setSignUpResult] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleInputChange = (event) => {
        const newFormData = { ...formData, [event.target.name]: event.target.value };
        setFormData(newFormData);

        // If none of the fields are empty, the form is valid
        setIsFormValid(Object.values(newFormData).every((field) => field !== ''));
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

        try {
            const result = await axios.post("/api/user", formData);
            const data = result.data;

            if (data && !data.err && data.data && data.data.token) {
                setSignUpResult("success");
                localStorage.setItem("auth-token", data.data.token);
            } else {
                setSignUpResult("fail");
            }
        } catch (error) {
            console.error(error);
            setSignUpResult("fail");
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
                                    required
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

                            <div className="form-group mt-2">
                                <button
                                    type="submit"
                                    className="sign-up-buttons"
                                    disabled={!isFormValid}
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
                                    Login
                                </button>
                            </div>
                        </section>
                    </form>

                    {signUpResult === "success" && (
                        <div className="alert alert-success" role="alert">
                            SignUp successful!
                            {(window.location.href = "/")}
                        </div>
                    )}

                    {signUpResult === "fail" && (
                        <div className="alert alert-danger" role="alert">
                            SignUp failed!
                        </div>
                    )}
                </section>
            </>
        );
    }
};

export default SignUpPage;

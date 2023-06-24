import { useState, useContext, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../contexts/UserContext";
import image from '../components/assets/images/login.jpg'
import Loading from '../components/Loading'


const LoginPage = () => {

  const defForm = { email: "", password: "" }
  const [formData, setFormData] = useState(defForm)
  const [loginResult, setLoginResult] = useState("")
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setIsLoading(false); // Image loaded, set loading state to false
    } // Image loaded
    img.onerror = (error) => console.error('Failed to load image', error);
  }, []);

  const handleFormSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    const query = await fetch("/api/user/auth", {
      method: "post",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const result = await query.json();

    if (result && !result.err && result.data && result.data.token) {
      setLoginResult("success");
      localStorage.setItem("auth-token", result.data.token);
      setUser(result.data.user)
      navigate("/");
    } else {
      setLoginResult("fail");
    }
  };

  const handleFormSubmitSignUp = (event) => {
    event.preventDefault()

    navigate("/signup");
  }


  if (isLoading) {
    return <Loading />
  
  } else {
    return (
    <div className="full-page-background">

      <form className="login-form-container">
        <div className='form-background'>
          <h2 className="welcome-to-nile">Welcome to Nile</h2>
        <h3 className="login-h3">Login</h3>

          <div className="login-forms">
            <label className="label-title">Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="john@gmail.com"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="login-forms">
            <label className="label-title">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group mt-2">
            <button className="signup-buttons" onClick={handleFormSubmit}>Log Me In!</button>
          </div>
          <div className="login-signup-section">
            <p>Not a user? Sign up!</p>
            <div className="form-group mt-2">
              <button className="signup-buttons" onClick={handleFormSubmitSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </form>

      {loginResult === "success" && (
        <div className="alert alert-success" role="alert">
          Login successful!
        </div>
      )}

      {loginResult === "fail" && (
        <div className="alert alert-danger" role="alert">
          Login failed!
        </div>
      )}
    </div>
  )
}
}

export default LoginPage;

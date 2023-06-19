import { useState } from "react"

const SignupPage = (props) => {

  const defForm = { name: "", email: "", password: "" }
  const [ formData, setFormData ] = useState(defForm)
  const [ signupResult, setSignupResult ] = useState("")

  const handleInputChange = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value})
  }

  const handleFormSubmit = async(event) => {
    event.preventDefault()
    const query = await fetch("/api/user", {
      method: "post",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    })
  
    if( !query.ok ) {
      setSignupResult("fail")
    } else {
      const result = await query.json()
      if( result && !result.err && result.data && result.data.token ){
        setSignupResult("success")
        localStorage.setItem('auth-token', result.data.token) // Set token to local storage
      } else {
        setSignupResult("fail")
      }
    }
  }  
  

  return (
    <>
      <h1>Signup Page</h1>

      <form className="form mb-3">
        <div className="form-group">
          <label>Name</label>
          <input   
            type="text"
            name="name"
            placeholder="Your Name"
            className="form-control"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input   
            type="text"
            name="email"
            placeholder="john@gmail.com"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input   
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group mt-2">
          <button className="btn btn-primary" onClick={handleFormSubmit}>Sign Me Up!</button>
        </div>
      </form>

      { signupResult === "success" && (
        <div className="alert alert-success" role="alert">
          Signup successful!
          {window.location.href="/"}
        </div>
      )}

      { signupResult === "fail" && (
        <div className="alert alert-danger" role="alert">
          Signup failed!
        </div>
      )}
    </>
  )
}

export default SignupPage

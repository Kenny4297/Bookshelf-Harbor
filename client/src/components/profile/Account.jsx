import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image } from 'cloudinary-react';
import Axios from 'axios';
import cloudinary from 'cloudinary-core';
import { UserContext } from "../../contexts/UserContext";
import noUser from '../../components/assets/images/noUser.png'

const Account = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "", address: "", profileImage: "" });
  const [imageSelected, setImageSelected] = useState('');
  const [updateResult, setUpdateResult] = useState("");
  const [userUrl, setUserUrl] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [showMessage, setShowMessage] = useState(false);
  const [showEmailMessage, setShowEmailMessage] = useState(false);


  const cld = new cloudinary.Cloudinary({cloud_name: 'diwhrgwml'});

  const handleInputChange = (event) => {
    if (event.target.name === 'password' && event.target.value === '') {
      return;
    }
  
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const getUserData = async () => {
    const resp = await Axios.get(`/api/user/${userId}`);
    if(resp.data) {
        setFormData(resp.data);
          if(resp.data.profileImage) {
            setUserUrl(resp.data.profileImage);
          }
        }
    };

    const update = async (event) => {
      console.log("Update function firing")
      event?.preventDefault();
  
      let dataToSend = { ...formData };
      
      // If password field is empty, remove it from the request
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
  
      if(userUrl) {
          dataToSend.profileImage = userUrl;
      }
  
      const resp = await Axios.put(`/api/user/${userId}`, dataToSend);
      
      if(resp.status !== 200) { 
          return setUpdateResult("fail");
      }
      // Updating the user context
      setUser({...user, profileImage: userUrl});
  
      setUpdateResult("success");
      navigate(`/profile/${userId}`);
      alert("Profile updated successfully!");
    };
  
    

    // const uploadImage = async (event) => {
    //     event.preventDefault();
        
    //     const formData = new FormData();
    //     formData.append("file", imageSelected);
    //     formData.append("upload_preset", "fxbnekpl");
        
    //     const response = await Axios.post("https://api.cloudinary.com/v1_1/diwhrgwml/image/upload", formData);
        
    //     if (response.data) {
    //       const publicId = response.data.public_id;
    //       const url = cld.url(publicId);
    //       setUserUrl(url);
    //       console.log(url);
    //     }
    //   };

      const handleFileChange = async (event) => {
        setImageSelected(event.target.files[0]);
        
        event.preventDefault();
      
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append("upload_preset", "fxbnekpl");
        
        const response = await Axios.post("https://api.cloudinary.com/v1_1/diwhrgwml/image/upload", formData);
        
        if (response.data) {
          const publicId = response.data.public_id;
          const url = cld.url(publicId);
          setUserUrl(url);
        }
      };

      const handleResetPasswordClick = (event) => {
        event.preventDefault();
        setShowMessage(!showMessage);
      }

      const handleChangeEmailClick = (event) => {
        event.preventDefault();
        setShowEmailMessage(!showEmailMessage);
      };
      
      

  useEffect(() => {
    getUserData();
    console.log(user)
  }, [userId]);

  useEffect(() => {
    console.log(userUrl);
  }, [userUrl]);

  return (
    <>
    <div className="account-container">

      <div className="form-container">
      <h2 className='account-h2'>Edit Your Profile</h2>
      <div style={{ width: "50%" }}>
        <form className="account-form">
            <label className="account-form-label">Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="name" 
              placeholder={formData.name || "No information currently set"} 
              onChange={handleInputChange}
            />

          
            <label className="account-form-label">Address</label>
            <input 
              type="text" 
              className="form-control" 
              name="address" 
              placeholder={formData.address || "No information currently set"} 
              onChange={handleInputChange}
            />

            <label className="account-form-label">Phone Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="phone" 
              placeholder={formData.phone || "No information currently set"} 
              onChange={handleInputChange}
            />

            {/* <label className="account-form-label">Email Address</label>
            <input 
              type="text" 
              className="form-control" 
              name="email" 
              placeholder={formData.email || "No information currently set"} 
              onChange={handleInputChange}
            /> */}

            <p className="account-form-label">Email: {formData.email}</p>

            <button type="button" className="account-email-button" onClick={handleChangeEmailClick}>
              Change Email Address
            </button>
            {showEmailMessage && 
              <div>
                Normally you would receive an email with a link to change your email. However, for the purpose of this demonstration, no email will be sent.
              </div>
            }




            <div style={{display:'flex', flexDirection:'column'}}>
              <button className="account-password-button" onClick={handleResetPasswordClick}>
                Reset Password
              </button>
              {showMessage && 
                <div>
                  Normally you would receive an email asking to verify yourself, along with a link to reset your password. 
                  However, for the purpose of this demonstration and to protect your privacy, no email will be sent.
                </div>
              }
              <div className="update-profile-button-container">
                <button onClick={update} className="update-profile-button">Update Profile</button>
              </div>
              

              
            </div>

        </form>
        {updateResult === "success" && (
          <div className="alert alert-success" role="alert">
            Update successful!
          </div>
        )}
        {updateResult === "fail" && (
          <div className="alert alert-danger" role="alert">
            Update failed!
          </div>
        )}
      </div>
      </div>
      <div className="profile-image-container">
        <h2 className="profile-image-h2">Edit Profile Image</h2>
        {userUrl 
          ? <Image className="profile-img" cloudName="diwhrgwml" publicId={userUrl}/>
          : <img src={noUser} alt="No User" className="profile-img" />
        }

        <label htmlFor="fileInput" className="file-input-label">
          Upload File
          <input id="fileInput" type="file" className="file-input" onChange={handleFileChange} />
      </label>
                  
      </div>
      
    </div>

    </>
  );
};

export default Account;

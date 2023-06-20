import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image } from 'cloudinary-react';
import Axios from 'axios';
import cloudinary from 'cloudinary-core';
import { UserContext } from "../../contexts/UserContext";

const Account = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "", address: "", profileImage: "" });
  const [imageSelected, setImageSelected] = useState('');
  const [updateResult, setUpdateResult] = useState("");
  const [userUrl, setUserUrl] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);

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
                setUserUrl(cld.url(resp.data.profileImage.url));
            }
        }
    };

    const update = async (event) => {
        console.log("Update function firing")
        event?.preventDefault();
    
        let dataToSend = { ...formData };
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
    

    const uploadImage = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("file", imageSelected);
        formData.append("upload_preset", "fxbnekpl");
        
        const response = await Axios.post("https://api.cloudinary.com/v1_1/diwhrgwml/image/upload", formData);
        
        if (response.data) {
          const publicId = response.data.public_id;
          const url = cld.url(publicId);
          setUserUrl(url);
          console.log(url);
        }
      };

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
      

  useEffect(() => {
    getUserData();
  }, [userId]);

  useEffect(() => {
    console.log(userUrl);
  }, [userId]);

  return (
    <>
      <h1>Edit Your Profile</h1>
      <div style={{ width: "50%" }}>
        <form className="mb-2">
          <div className="form-group mb-2">
            <label>Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="name" 
              placeholder={formData.name || "No information currently set"} 
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <label>Address</label>
            <input 
              type="text" 
              className="form-control" 
              name="address" 
              placeholder={formData.address || "No information currently set"} 
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <label>Phone Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="phone" 
              placeholder={formData.phone || "No information currently set"} 
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <label>Email Address</label>
            <input 
              type="text" 
              className="form-control" 
              name="email" 
              placeholder={formData.email || "No information currently set"} 
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mb-2">
            <label>Profile Image</label>
            <input type="file" onChange={handleFileChange}/>
            {userUrl && <Image style={{width: "200px"}} cloudName="diwhrgwml" publicId={userUrl}/>}
            </div>
          <div className="form-group">
            <button onClick={update} className="btn btn-primary">Update Profile</button>
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
    </>
  );
};

export default Account;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Image } from 'cloudinary-react';
import Axios from 'axios';
import cloudinary from 'cloudinary-core';

const Account = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "", address: "", profileImage: "" });
  const [imageSelected, setImageSelected] = useState('');
  const [updateResult, setUpdateResult] = useState("");
  const [userUrl, setUserUrl] = useState(null);

  const cld = new cloudinary.Cloudinary({cloud_name: 'diwhrgwml'});

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const getUserData = async () => {
    const resp = await Axios.get(`/api/user/${userId}`);
    if(resp.data) {
      setFormData(resp.data);
      setUserUrl(cld.url(resp.data.profileImage.url));
    }
  };

  const update = async (event) => {
    event?.preventDefault();
    const resp = await Axios.put(`/api/user/updateProfileImage/${userId}`, {
      ...formData,
      profileImage: { url: cld.url(userUrl) },
    });
    if(!resp.ok) {
      return setUpdateResult("fail");
    }
    setUpdateResult("success");
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "fxbnekpl");
    const response = await Axios.post("https://api.cloudinary.com/v1_1/diwhrgwml/image/upload", formData);
    const publicId = response.data.public_id;
    setUserUrl(cld.url(publicId));
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

  return (
    <>
      <h1>Your Profile</h1>
      <div style={{ width: "50%" }}>
        <form onSubmit={update} className="mb-2">
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
            <input type="file" onChange={(event) => setImageSelected(event.target.files[0])}/>
            <button onClick={uploadImage}>Upload Image</button>
            {userUrl && <Image style={{width: "200px"}} cloudName="diwhrgwml" publicId={userUrl}/>}
          </div>
          <div className="form-group">
            <button className="btn btn-primary">Update Profile</button>
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Image } from 'cloudinary-react';
import Axios from 'axios';
import cloudinary from 'cloudinary-core';

const Account = ({ user }) => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "", address: "", profileImage: "" });
  const [imageSelected, setImageSelected] = useState(null);
  const [updateResult, setUpdateResult] = useState("");
  const cld = new cloudinary.Cloudinary({ cloud_name: 'diwhrgwml' });
  const [userUrl, setUserUrl] = useState(null);

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const updateProfileImage = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", imageSelected);
      formData.append("upload_preset", "fxbnekpl");

      const response = await Axios.post("https://api.cloudinary.com/v1_1/diwhrgwml/image/upload", formData);
      const imageUrl = response.data.secure_url;

      setFormData(prevState => ({ ...prevState, profileImage: imageUrl }));
      setUserUrl(cld.url(imageUrl));
    } catch (err) {
      console.log(err);
    }
  }

  const update = async (event) => {
    event.preventDefault();
    try {
      const resp = await Axios.put(`/api/user/${userId}`, formData);

      if (!resp.status === 200) {
        return setUpdateResult("fail");
      }
      setUpdateResult("success");
    } catch (error) {
      console.error(error);
      setUpdateResult("fail");
    }
  }

  useEffect(() => {
    if (user) setFormData({ ...formData, email: user.email, name: user.name, phone: user.phone, address: user.address, profileImage: user.profileImage });
  }, [user]);

  return (
    <>
      <h1>Your Profile</h1>

      <div style={{ width: "50%"}}>
        <form onSubmit={update} className="mb-2">

          <div className="form-group mb-2">
            <label>Name</label>
            <input 
              type="text" 
              className="form-control" 
              name="name" 
              value={formData.name || ""} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Address</label>
            <input 
              type="text" 
              className="form-control" 
              name="address" 
              value={formData.address || ""} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Phone Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="phone" 
              value={formData.phone || ""} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Email Address</label>
            <input 
              type="text" 
              className="form-control" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Profile Image URL</label>
            <input 
              type="text" 
              className="form-control" 
              name="profileImage" 
              value={formData.profileImage || ""} 
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group mb-2">
            <label>Profile Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(event) => setImageSelected(event.target.files[0])}
            />
            <button className="btn btn-primary" onClick={updateProfileImage}>Upload Image</button>
            {userUrl && <Image style={{ width: "200px" }} cloudName="diwhrgwml" publicId={userUrl} />}
          </div>

          <div className="form-group">
            <button className="btn btn-primary">Update Profile</button>
          </div>
        </form>

        { updateResult === "success" && (
          <div className="alert alert-success" role="alert">
            Update successful!
          </div>
        )}

        { updateResult === "fail" && (
          <div className="alert alert-danger" role="alert">
            Update failed!
          </div>
        )}
      </div>
    </>
  )
}

export default Account;

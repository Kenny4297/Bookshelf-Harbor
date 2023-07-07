import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import Axios from "axios";
import cloudinary from "cloudinary-core";
import { UserContext } from "../../contexts/UserContext";
import noUser from "../../components/assets/images/noUser.png";

const Account = () => {
    const { userId } = useParams();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phoneNumber: "",
        address: "",
        profileImage: "",
    });

    const [updateResult, setUpdateResult] = useState("");
    const [userUrl, setUserUrl] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [showMessage, setShowMessage] = useState(false);
    const [showEmailMessage, setShowEmailMessage] = useState(false);

    const cld = new cloudinary.Cloudinary({ cloud_name: "diwhrgwml" });

    const handleInputChange = (event) => {
        if (event.target.name === "password" && event.target.value === "") {
            return;
        }

        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const getUserData = useCallback(async () => {
        const resp = await Axios.get(`/api/user/${userId}`);
        console.log(resp.data);
        if (resp.data) {
            setFormData(resp.data);
            if (resp.data.profileImage) {
                setUserUrl(resp.data.profileImage);
            }
        }
    }, [userId]);

    const update = async (event) => {
        event?.preventDefault();

        let dataToSend = { ...formData };

        // If password field is empty, remove it from the request
        if (!dataToSend.password) {
            delete dataToSend.password;
        }

        if (userUrl) {
            dataToSend.profileImage = userUrl;
        }

        const resp = await Axios.put(`/api/user/${userId}`, dataToSend);

        if (resp.status !== 200) {
            return setUpdateResult("fail");
        }
        // Updating the user context
        setUser({ ...user, profileImage: userUrl });

        setUpdateResult("success");
        navigate(`/profile/${userId}`);
        alert("Profile updated successfully!");
    };

    const handleFileChange = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append("upload_preset", "fxbnekpl");

        const response = await Axios.post(
            "https://api.cloudinary.com/v1_1/diwhrgwml/image/upload",
            formData
        );

        if (response.data) {
            const publicId = response.data.public_id;
            const url = cld.url(publicId);
            setUserUrl(url);
        }
    };

    const removeImage = async () => {
        if(userUrl) {
            let updatedData = { ...formData, profileImage: "" };  

            const resp = await Axios.put(`/api/user/${userId}`, updatedData);

            if (resp.status === 200) {
                setUserUrl("");  
                setFormData(updatedData);  
                alert("Profile image removed successfully!");
            } else {
                alert("Failed to remove profile image. Please try again.");
            }
        }
    };

    const handleResetPasswordClick = (event) => {
        event.preventDefault();
        setShowMessage(!showMessage);
    };

    const handleChangeEmailClick = (event) => {
        event.preventDefault();
        setShowEmailMessage(!showEmailMessage);
    };

    useEffect(() => {
        getUserData();
    }, [getUserData]);

    return (
        <>
            <section className="account-container">
                <section className="form-container">
                    <h2 className="account-h2" id="form-label">
                        Edit Your Profile
                    </h2>
                    <section style={{ width: "50%" }}>
                        <form
                            className="account-form"
                            aria-labelledby="form-label"
                        >
                            <label
                                htmlFor="name"
                                className="account-form-label"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                name="name"
                                placeholder={
                                    formData.name
                                }
                                onChange={handleInputChange}
                                aria-label="Name"
                            />

                            <label
                                htmlFor="address"
                                className="account-form-label"
                            >
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                className="form-control"
                                name="address"
                                placeholder={
                                    formData.address
                                }
                                onChange={handleInputChange}
                                aria-label="Address"
                            />

                            <label
                                htmlFor="phoneNumber"
                                className="account-form-label"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                className="form-control"
                                name="phoneNumber"
                                placeholder={
                                    formData.phoneNumber
                                }
                                onChange={handleInputChange}
                                aria-label="Phone Number"
                            />

                            <p className="account-form-label">
                                Email: {formData.email}
                            </p>

                            <button
                                type="button"
                                className="account-email-button"
                                onClick={handleChangeEmailClick}
                                aria-label="Change Email Address"
                            >
                                Change Email Address
                            </button>
                            {showEmailMessage && (
                                <div aria-live="polite">
                                    Normally you would receive an email with a
                                    link to change your email. However, for the
                                    purpose of this demonstration, no email will
                                    be sent.
                                </div>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <button
                                    className="account-password-button"
                                    onClick={handleResetPasswordClick}
                                    aria-label="Reset Password"
                                >
                                    Reset Password
                                </button>
                                {showMessage && (
                                    <div aria-live="polite">
                                        Normally you would receive an email
                                        asking to verify yourself, along with a
                                        link to reset your password. However,
                                        for the purpose of this demonstration
                                        and to protect your privacy, no email
                                        will be sent.
                                    </div>
                                )}
                                <div className="update-profile-button-container">
                                    <button
                                        onClick={update}
                                        className="update-profile-button"
                                        aria-label="Update Profile"
                                    >
                                        Update Profile
                                    </button>
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
                    </section>
                </section>
                <section className="profile-image-container">
                    <h2 className="profile-image-h2">Edit Profile Image</h2>
                    {userUrl ? (
                        <Image
                            className="profile-img"
                            cloudName="diwhrgwml"
                            publicId={userUrl}
                            alt="Profile Image"
                        />
                    ) : (
                        <img
                            src={noUser}
                            alt="No User"
                            className="profile-img"
                        />
                    )}

                    <label htmlFor="fileInput" className="file-input-label">
                        Upload File
                        <input
                            id="fileInput"
                            type="file"
                            className="file-input"
                            onChange={handleFileChange}
                            aria-label="Upload File"
                        />
                    </label>

                    <button 
                        onClick={removeImage} 
                        className="remove-image-button"
                        aria-label="Remove Profile Image"
                    >
                        Remove Profile Image
                    </button>
                </section>
            </section>
        </>
    );
};

export default Account;

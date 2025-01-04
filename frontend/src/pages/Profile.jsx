import React, { useEffect, useState } from "react";
import axios from "axios";
import { set } from "mongoose";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);


    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        newPassword: "",
        referral: "",
        mentalCondition: "",
        ageGroup: "",
        country: "",
        goals: "",
        preferences: ""
    });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);

        // Create preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePictureUpload = async () => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('image', profilePicture);

        try {
            const response = await axios.post("http://localhost:5000/upload-profile-picture", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            setProfile({ ...profile, imageUrl: response.data.imageUrl });
        } catch (err) {
            setError("Failed to upload profile picture");
        }
    };
    const handleVerifyEmail = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:5000/verify-email", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setError(null);
            // Show success message
            alert("Verification email sent! Please check your inbox.");
        } catch (err) {
            setError("Failed to send verification email. Please try again.");
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to view this page.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:5000/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const user = response.data.user;
                setProfile(user);
                setFormData({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    referral: user.referral,
                    mentalCondition: user.mentalCondition,
                    ageGroup: user.ageGroup,
                    country: user.country,
                    goals: user.goals,
                    preferences: user.preferences,
                    password: "",
                    newPassword: "",
                });
                setError(null);
                const response2 = await axios.get("http://localhost:5000/profile-picture", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfilePicture(`http://localhost:5000${response2.data.imageUrl}`);
            } catch (err) {
                setError("Failed to load profile. Please log in again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put("http://localhost:5000/profile", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (profilePicture) {
                await handleProfilePictureUpload();
            }
            setProfile(response.data.user);
            console.log(response.data.user);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Invalid data. Please check your inputs.");
            } else {
                setError("Failed to update profile. Please try again.");
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white/90 rounded-xl shadow-md border border-[#C5C5C5]">
            {error && (
                <div className="bg-[#C5C5C5]/20 border border-[#4D6A6D] text-[#4C5B61] px-4 py-3 rounded relative mb-6" role="alert">
                    {error}
                </div>
            )}
            <div className="text-center">
                <div className="relative inline-block w-32 h-32 mb-6">
                    <img
                        src={imagePreview || profilePicture || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-sage-100 object-cover"
                    />

                    {isEditing && (
                        <label className="absolute bottom-2 right-2 bg-[#4D6A6D] p-2 rounded-full cursor-pointer hover:bg-[#829191] transition-all duration-300 ease-in-out z-10">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </label>
                    )}
                </div>
                {!isEditing ? (
                    <>
                        <h3 className="text-xl font-semibold text-[#4D6A6D]">{profile.name}</h3>

                        <p className="text-[#949896] mt-2">
                            Email: {profile.email}
                            {profile.verified ? (
                                <span className="ml-2 text-[#4D6A6D]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            ) : (
                                <button
                                    onClick={handleVerifyEmail}
                                    className="ml-2 px-3 py-1 text-sm bg-[#4D6A6D] text-white rounded-md hover:bg-[#829191] transition-all duration-300 ease-in-out"
                                >
                                    Verify Email
                                </button>
                            )}
                        </p>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-6 px-8 py-3 bg-[#4D6A6D] text-white rounded-lg hover:bg-[#829191] transition-all duration-300 ease-in-out"
                        >
                            Edit Profile
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <select
                            name="referral"
                            value={formData.referral}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        >
                            <option value="">How did you find us?</option>
                            <option value="social">Social Media</option>
                            <option value="friend">Friend</option>
                            <option value="search">Search Engine</option>
                            <option value="other">Other</option>
                        </select>

                        <select
                            name="mentalCondition"
                            value={formData.mentalCondition}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        >
                            <option value="">Select your condition</option>
                            <option value="Anxiety">Anxiety</option>
                            <option value="Depression">Depression</option>
                            <option value="PTSD">PTSD</option>
                            <option value="Bipolar">Bipolar</option>
                            <option value="Other">Other</option>
                        </select>

                        <select
                            name="ageGroup"
                            value={formData.ageGroup}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        >
                            <option value="">Select age group</option>
                            <option value="Under 18">Under 18</option>
                            <option value="18-24">18-24</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45-54">45-54</option>
                            <option value="55+">55+</option>
                        </select>

                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <textarea
                            name="goals"
                            value={formData.goals}
                            onChange={handleChange}
                            placeholder="What are your goals?"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <textarea
                            name="preferences"
                            value={formData.preferences}
                            onChange={handleChange}
                            placeholder="Your preferences"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Current Password"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="New Password (optional)"
                            className="w-full px-4 py-3 border border-[#C5C5C5] rounded-lg focus:outline-none focus:border-[#4D6A6D] bg-white/80"
                        />
                        <button
                            type="submit"
                            className="w-full bg-[#4D6A6D] text-white py-3 rounded-lg hover:bg-[#829191] transition-all duration-300 ease-in-out"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;

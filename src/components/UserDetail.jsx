import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserDetails = () => {
    const location = useLocation(); // Get passed state
    const navigate = useNavigate();

    const user = location.state?.user; // Extract user data

    const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
    const [editedData, setEditedData] = useState({
        mobile_number: user?.mobile_number || "",
        alt_mobile_number: user?.alt_mobile_number || "",
        email: user?.email || "",
        prefer_caste: user?.prefer_caste || "",
        prefer_district: user?.prefer_district || "",
        prefer_education: user?.prefer_education || "",
    });

    if (!user) {
        return (
            <div className="user-details-container">
                <p>No user details found.</p>
                <button className="btn-back" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Updated Data:", editedData);
        setIsEditing(false);
        // API call or data save logic can be added here
    };

    return (
        <div className="user-details-container">
            <h1 className="user-details-title">{user.name}'s Details</h1>
            <div className="user-details-header">
                <img
                    src={`https://bank.infiscripts.com/${user.profile_pic}`}
                    alt="Profile"
                    className="user-profile-pic"
                />
                <div className="user-basic-info">
                    <h2>{user.name}</h2>
                    <p>
                        <strong>Email:</strong>
                        {!isEditing ? (
                            user.email
                        ) : (
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input-field"
                                value={editedData.email}
                                onChange={handleInputChange}
                            />
                        )}
                    </p>
                    <p><strong>Age:</strong> {user.age}</p>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>DOB:</strong> {user.dob}</p>
                </div>
            </div>
            <div className="user-details-body">
                <h3>Personal Information</h3>
                <div className="details-grid">
                    <p>
                        <strong>Mobile:</strong>
                        {!isEditing ? (
                            user.mobile_number
                        ) : (

                            <input
                                type="text"
                                name="mobile_number"
                                value={editedData.mobile_number}
                                className="input-field"
                                onChange={handleInputChange}
                            />
                        )}
                    </p>
                    <p>
                        <strong>Alt No:</strong>
                        {!isEditing ? (
                            user.alt_mobile_number
                        ) : (
                            <input
                                type="text"
                                name="alt_mobile_number"
                                className="input-field"
                                value={editedData.alt_mobile_number}
                                onChange={handleInputChange}
                            />
                        )}
                    </p>
                    <p><strong>Gender:</strong> {user.gender}</p>
                    <p><strong>Marital Status:</strong> {user.marital_status}</p>
                    <p><strong>Religion:</strong> {user.religion}</p>
                    <p><strong>Education:</strong> {user.education}</p>
                    <p><strong>Mother tongue:</strong> {user.mother_tongue}</p>
                    <p><strong>Religion:</strong> {user.religion}</p>
                    <p><strong>Caste:</strong> {user.caste}</p>
                    <p><strong>Sub caste:</strong> {user.sub_caste}</p>
                    <p><strong>Gothra:</strong> {user.gothra}</p>
                    <p><strong>Height:</strong> {user.height}</p>
                    <p><strong>Weight:</strong> {user.weight}</p>
                    <p><strong>Disability:</strong> {user.disability}</p>
                    <p><strong>District:</strong> {user.district}</p>
                    <p><strong>City:</strong> {user.city}</p>
                    <p><strong>Blood group:</strong> {user.bloodgroup}</p>
                    <p><strong>Eating habit:</strong> {user.eating_habit}</p>
                    <p><strong>Employed:</strong> {user.employed}</p>
                    <p><strong>Occupation:</strong> {user.occupation}</p>
                    <p><strong>Work country:</strong> {user.work_country}</p>
                    <p><strong>Annual income:</strong> {user.annual_income}</p>
                    <p><strong>Position:</strong> {user.position}</p>
                    <p><strong>Family status:</strong> {user.family_status}</p>
                    <p><strong>Family type:</strong> {user.family_type}</p>

                    <div className="scrollable-container">
                        <p>
                            <strong>Preferred Caste:</strong>
                            {!isEditing ? (
                                user.prefer_caste.replace(/[\[\]\\"]/g, "").trim()
                            ) : (
                                <textarea
                                    name="prefer_caste"
                                    className="input-field"
                                    value={editedData.prefer_caste.replace(/[\[\]\\"]/g, "").trim()}
                                    onChange={handleInputChange}
                                />
                            )}
                        </p>
                        <p>
                            <strong>Preferred District:</strong>
                            {!isEditing ? (
                                user.prefer_district.replace(/[\[\]\\"]/g, "").trim()
                            ) : (
                                <textarea
                                    name="prefer_district"
                                    className="input-field"
                                    value={editedData.prefer_district.replace(/[\[\]\\"]/g, "").trim()}
                                    onChange={handleInputChange}
                                />
                            )}
                        </p>
                        <p>
                            <strong>Preferred Education:</strong>
                            {!isEditing ? (
                                user.prefer_education.replace(/[\[\]\\"]/g, "").trim()
                            ) : (
                                <textarea
                                    name="prefer_education"
                                    className="input-field"
                                    value={editedData.prefer_education.replace(/[\[\]\\"]/g, "").trim()}
                                    onChange={handleInputChange}
                                />
                            )}
                        </p>
                    </div>
                    {/* <p><strong>Contact:</strong> {user.contact.replace(/[\[\]\\"]/g, "").trim()}</p> */}
                    <p><strong>Work Country:</strong> {user.work_country.replace(/[\[\]\\"]/g, "").trim()}</p>
                </div>
            </div>
            <div className="user-horoscope-section">
                <h3>Horoscope</h3>
                <div className="horoscope-card">
                    <img
                        src={`https://bank.infiscripts.com/${user.horoscope}`}
                        alt="Horoscope"
                        className="horoscope-image"
                    />
                    <p><strong>Zodiac:</strong> {user.zodiac}</p>
                    <p><strong>Star:</strong> {user.star}</p>
                    <p><strong>Dosham:</strong> {user.dosham}</p>
                </div>
            </div>
            <div className="user-footer">
                {!isEditing ? (
                    <button className="button-34 btn-edit" role="button" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                ) : (
                    <>
                        <button className="button-34 btn-save" role="button" onClick={handleSave}>
                            Save
                        </button>
                        <button className="button-34 btn-cancel" role="button" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </>
                )}
                <button className="button-34 btn-back" role="button" onClick={() => navigate(-2)}>
                    Go Back
                </button>

            </div>
        </div>
    );
};

export default UserDetails;

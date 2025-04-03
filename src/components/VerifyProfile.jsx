import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [showMoreDetails, setShowMoreDetails] = useState({});
    const [creditUpdate, setCreditUpdate] = useState({});
    const [showCreditInput, setShowCreditInput] = useState({});
    const navigate = useNavigate(); // For navigation
    const [filter, setFilter] = useState('all'); // To filter users
    const [searchQuery, setSearchQuery] = useState('');
    const [credit, setCredit] = useState(false);
    const [creditData, setCreditData] = useState(null);
    const [newCreditsVerified, setNewCreditsVerified] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null);



    const handleCreditClick = () => {
        setCredit(true);
        setFilter('creditPoints');
    };

    // Fetch credit data
    useEffect(() => {
        if (credit) {
            axios
                .get("https://bank.infiscripts.com/admincredits.php")
                .then((response) => {
                    if (response.data && response.data.status === "success") {
                        const data = response.data.data;  // Get all data items
                        setCreditData(data);  // Set the data array
                    } else {
                        setCreditData([]);  // Handle case where data is not available
                    }
                })
                .catch((error) => {
                    console.error("Error fetching credit data:", error);
                    setCreditData([]);  // Handle error case
                });
        }
    }, [credit]);

    // Handle input change and set the selected item
    const handleCreditsChange = (e, id) => {
        const value = e.target.value;
        setCreditData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, newCreditsVerified: value } : item
            )
        );
        setSelectedItemId(id);  // Store the selected item ID
    };

    // Handle save action
    const handleSave = () => {
        if (selectedItemId && creditData) {
            // Find the selected item from the creditData
            const selectedItem = creditData.find(item => item.id === selectedItemId);

            // Prepare the updated data for the selected item
            const updatedData = {
                id: selectedItem.id,
                creditsverified: selectedItem.newCreditsVerified || selectedItem.creditsverified,
            };

            // Log the data to verify the format
            console.log("Sending data:", updatedData);

            // Send the updated data to the backend
            axios
                .post("https://bank.infiscripts.com/admincredits.php", updatedData)
                .then((response) => {
                    console.log("Credit data updated successfully:", response.data);

                    // Update the UI to reflect the changes
                    setCreditData((prevData) =>
                        prevData.map((item) =>
                            item.id === updatedData.id
                                ? { ...item, creditsverified: updatedData.creditsverified, newCreditsVerified: undefined }
                                : item
                        )
                    );

                    // Reset the selected item ID
                    setSelectedItemId(null);
                })
                .catch((error) => {
                    console.error("Error updating credit data:", error);
                });
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );


    useEffect(() => {
        axios
            .get('https://bank.infiscripts.com/adminview.php')
            .then((response) => {
                setUsers(response.data.data || []);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handleViewMore = (userId) => {
        setShowMoreDetails((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const handleCreditUpdateToggle = (userId) => {
        setShowCreditInput((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const handleCreditChange = (userId, value) => {
        setCreditUpdate((prev) => ({
            ...prev,
            [userId]: value,
        }));
    };

    const handleCreditSubmit = (userId) => {
        console.log(`Credit points for user ${userId}:`, creditUpdate[userId]);
        setShowCreditInput((prev) => ({
            ...prev,
            [userId]: false,
        }));
    };

    const handleContainerClick = (user) => {
        navigate(`/user-details/${user.id}`, { state: { user } });
    };

    const verifiedUsers = users.filter((user) => user.verified);
    const notVerifiedUsers = users.filter((user) => !user.verified);




    const handleVerifyUser = async (user) => {
        try {
            // Make an API call to update the user's verified status
            const response = await fetch('https://bank.infiscripts.com/userverify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    verified: 1, // Update verified status to 1
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Update the user's verified status in the frontend
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === user.id ? { ...u, verified: 1 } : u
                    )
                );
            } else {
                console.error('Failed to verify user:', result.message);
            }
        } catch (error) {
            console.error('Error verifying user:', error);
        }
    };


    const renderUserCard = (user) => (
        <div
            className="user-card"
            key={user.id}
            onClick={() => handleContainerClick(user)}
        >
            <div className="user-header">
                <img
                    src={`https://bank.infiscripts.com/${user.profile_pic}`}
                    alt="Profile"
                    className="user-image"
                />
                <div className="user-info">
                    <h2>{user.name}</h2>
                </div>

            </div>

            {showMoreDetails[user.id] && (
                <div className="user-details">
                    <div className="detail">
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div className="detail">
                        <strong>Age:</strong> {user.age}
                    </div>
                    <div className="detail">
                        <strong>DOB:</strong> {user.dob}
                    </div>
                    <div className="detail">
                        <strong>Mobile:</strong> {user.mobile_number}
                    </div>
                    <div className="detail">
                        <strong>Alternate Mobile:</strong> {user.alt_mobile_number}
                    </div>
                    <div className="detail">
                        <strong>Gender:</strong> {user.gender}
                    </div>
                    <div className="detail">
                        <strong>Marital Status:</strong> {user.marital_status}
                    </div>
                    <div className="detail">
                        <strong>Mother Tongue:</strong> {user.mother_tongue}
                    </div>
                    <div className="detail">
                        <strong>Religion:</strong> {user.religion}
                    </div>
                    <div className="detail">
                        <strong>Caste:</strong> {user.caste}
                    </div>
                    <div className="detail">
                        <strong>Sub Caste:</strong> {user.sub_caste}
                    </div>
                    <div className="detail">
                        <strong>Gothra:</strong> {user.gothra}
                    </div>
                    <div className="detail">
                        <strong>Height:</strong> {user.height}
                    </div>
                    <div className="detail">
                        <strong>Weight:</strong> {user.weight}
                    </div>
                    <div className="detail">
                        <strong>Disability:</strong> {user.disability}
                    </div>
                    <div className="detail">
                        <strong>Zodiac:</strong> {user.zodiac}
                    </div>
                    <div className="detail">
                        <strong>Dosham:</strong> {user.dosham}
                    </div>
                    <div className="detail">
                        <strong>Star:</strong> {user.star}
                    </div>
                    <div className="detail">
                        <strong>District:</strong> {user.district}
                    </div>
                    <div className="detail">
                        <strong>City:</strong> {user.city}
                    </div>
                    <div className="detail">
                        <strong>Education:</strong> {user.education}
                    </div>
                    <div className="detail">
                        <strong>Blood Group:</strong> {user.bloodgroup}
                    </div>
                    <div className="detail">
                        <strong>Eating Habit:</strong> {user.eating_habit}
                    </div>
                    <div className="detail">
                        <strong>Employed:</strong> {user.employed}
                    </div>
                    <div className="detail">
                        <strong>Occupation:</strong> {user.occupation}
                    </div>
                    <div className="detail">
                        <strong>Annual Income:</strong> {user.annual_income}
                    </div>
                    <div className="detail">
                        <strong>Position:</strong> {user.position}
                    </div>
                    <div className="detail">
                        <strong>Family Status:</strong> {user.family_status}
                    </div>
                    <div className="detail">
                        <strong>Family Type:</strong> {user.family_type}
                    </div>
                    <div className="scrollable-container">
                        <div className="detail">
                            <strong>Preferred Caste:</strong> {user.prefer_caste}
                        </div>
                        <div className="detail">
                            <strong>Preferred District:</strong> {user.prefer_district}
                        </div>
                        <div className="detail">
                            <strong>Preferred Education:</strong> {user.prefer_education}
                        </div>
                    </div>
                    <div className="detail">
                        <strong>Contact:</strong> {user.contact}
                    </div>
                    <div className="detail">
                        <strong>Work Country:</strong> {user.work_country}
                    </div>
                    <div className="user-media">
                        <img
                            src={`https://bank.infiscripts.com/${user.horoscope}`}
                            alt="Horoscope"
                            className="user-horoscope"
                        />
                    </div>
                    <div className="user-footer">
                        <div className="detail">
                            <strong>Created At:</strong> {user.created_at}
                        </div>
                        <div className="detail">
                            <strong>Status:</strong> {user.verified ? 'Verified' : 'Not Verified'}
                        </div>
                    </div>
                </div>
            )}

            <div className="user-actions">
                {user.verified ? (
                    <button className="btn btn-verified" disabled>
                        Verified
                    </button>
                ) : (
                    <button
                        className="btn btn-verify"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyUser(user); // Call the verify function
                        }}
                    >
                        Verify
                    </button>

                )}

                <button
                    className="view-more"
                    onClick={() => handleContainerClick(user)}
                >
                    View
                </button>

                {/* <button
                    className="btn btn-report"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Report user ${user.id}`);
                    }}
                >
                    Report
                </button> */}
            </div>
        </div>
    );

    return (
        <div className="user-table">
            <div className="flex justify-center items-center">
                <div className="bg-[#F11A7B] p-4 rounded-lg shadow-lg border mb-10 border-gray-200">
                    <h1 className="text-2xl font-bold text-center text-white">User List</h1>
                </div>
            </div>

            {users.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {/* Filter and Report Buttons */}
                    <div className="flex flex-wrap items-center gap-4 p-4">
                        {[
                            { label: 'All Users', value: 'all' },
                            { label: 'Verified Users', value: 'verified' },
                            { label: 'Unverified Users', value: 'unverified' },
                            { label: 'Credit Points', value: 'creditPoints' },
                        ].map(({ label, value }) => (
                            <button
                                key={value}
                                className={`px-4 py-2 rounded-lg transition-transform duration-300 ${filter === value
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white scale-105'
                                        : 'bg-gray-200 text-gray-800 hover:bg-blue-400 hover:text-white'
                                    }`}
                                onClick={() => {
                                    setFilter(value);
                                    if (value === 'creditPoints') {
                                        handleCreditClick();
                                    } else {
                                        setCredit(false);
                                    }
                                }}
                            >
                                {label}
                            </button>
                        ))}

                        <Link to="/reports" className="flex items-center">
                            <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg transition-transform duration-300 hover:scale-105 hover:from-red-500 hover:to-red-700">
                                Report
                            </button>
                        </Link>

                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search by ID, name, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
                        />
                    </div>



                    {/* Filtered User List */}
                    {/* Render based on filter */}
                    {filter === 'all' && !credit && (
                        <>
                            <h2 className="text-3xl font-extrabold text-red-600 tracking-wide uppercase text-center mt-6">Unverified Profiles </h2>

                            <div className="user-cards">
                                {notVerifiedUsers
                                    .filter((user) => {
                                        if (!isNaN(searchQuery) && searchQuery.trim() !== "") {
                                            return user.id.toString() === searchQuery.trim();
                                        }
                                        return (
                                            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                    })
                                    .map((user) => renderUserCard(user))}
                            </div>

                            <h2 className="text-3xl font-extrabold text-blue-600 tracking-wide uppercase mt-16 text-center">Verified Profiles</h2>
                            <div className="user-cards">
                                {verifiedUsers
                                    .filter((user) => {
                                        if (!isNaN(searchQuery) && searchQuery.trim() !== "") {
                                            return user.id.toString() === searchQuery.trim();
                                        }
                                        return (
                                            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                    })
                                    .map((user) => renderUserCard(user))}
                            </div>
                        </>
                    )}

                    {filter === 'creditPoints' && credit && (
                       
                        <div className="container mx-auto p-4">
                        <h2 className="text-3xl font-extrabold text-green-600 tracking-wide uppercase mt-2 mb-6 text-center">Credit Points</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                                {creditData && creditData.length > 0 ? (
                                    creditData.map((item) => (
                                        <div key={item.id} className="bg-gray-100 shadow-sm rounded-lg p-6 border-0 border-pink-300">
                                            <p className="text-base font-semibold text-gray-800 flex justify-between">
                                                <span><strong>ID:</strong></span>
                                                <span>{item.id}</span>
                                            </p>

                                            <p className="text-base text-gray-700 mt-2 flex justify-between">
                                                <span><strong>Email or Phone:</strong></span>
                                                <span>{item.email_or_phone}</span>
                                            </p>

                                            <p className="text-base text-gray-700 mt-2 flex justify-between">
                                                <span><strong>UPI Transaction:</strong></span>
                                                <span>{item.upitrasnaction}</span>
                                            </p>

                                            <div
                                                className={`text-base text-gray-700 mt-2 flex justify-between ${item.id === selectedItemId ? 'bg-yellow-100' : ''}`}
                                                key={item.id}
                                            >
                                                <span><strong>Credits Verified:</strong></span>
                                                <input
                                                    type="number"
                                                    value={item.id === selectedItemId ? item.newCreditsVerified || item.creditsverified : item.creditsverified}
                                                    onChange={(e) => handleCreditsChange(e, item.id)}
                                                    className="ml-2 p-1 w-32 border border-gray-300 rounded-md"
                                                />
                                            </div>


                                            <div className="mt-4 flex gap-4 justify-between">
                                                <button
                                                    onClick={() => handleSave(item.id)}  // Pass the id to save for specific item
                                                    className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md shadow-md"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setCredit(false)}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center bg-gray-100 rounded-lg p-6">
                                        <p className="text-center mt-6 text-gray-600">Data is incomplete or unavailable.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}



                    {filter === 'verified' && !credit && (
                        <>
                        <h2 className="text-3xl font-extrabold text-blue-600 tracking-wide uppercase mt-6 text-center">Verified Profiles</h2>
                            <div className="user-cards">
                                {verifiedUsers
                                    .filter((user) => {
                                        if (!isNaN(searchQuery) && searchQuery.trim() !== "") {
                                            return user.id.toString() === searchQuery.trim();
                                        }
                                        return (
                                            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                    })
                                    .map((user) => renderUserCard(user))}
                            </div>
                        </>
                    )}

                    {filter === 'unverified' && !credit && (
                        <>
                        <h2 className="text-3xl font-extrabold text-red-600 tracking-wide uppercase text-center mt-6">Unverified Profiles </h2>
                            <div className="user-cards">
                                {notVerifiedUsers
                                    .filter((user) => {
                                        if (!isNaN(searchQuery) && searchQuery.trim() !== "") {
                                            return user.id.toString() === searchQuery.trim();
                                        }
                                        return (
                                            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                    })
                                    .map((user) => renderUserCard(user))}
                            </div>
                        </>
                    )}


                </div>
            )}



        </div>
    );

}

export default UserTable;
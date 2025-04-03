import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BrokerProfile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [editedBroker, setEditedBroker] = useState({});
    const [imagePreview, setImagePreview] = useState(null);



    // Function to fetch broker details
    useEffect(() => {
        axios.get('https://bank.infiscripts.com/broker-dealers.php')
            .then(response => {
                if (response.data.status === "success") {
                    setData(response.data.data);
                } else {
                    console.error('Unexpected response structure:', response.data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    // Handle input change for edited broker data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedBroker((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Preview the image
            setEditedBroker((prev) => ({
                ...prev,
                photo: file,
            }));
        }
    };

    // Handle save of edited data
    const handleSave = (index) => {
        const updatedData = [...data];
        updatedData[index] = { ...updatedData[index], ...editedBroker };

        setData(updatedData);
        setEditIndex(null);
        setEditedBroker({});
        setImagePreview(null);
        alert(`Broker ${updatedData[index].name} updated successfully!`);
    };

    return (
        <div className="p-6 font-sans bg-gray-100">
            <Link to="/brokerverify">
                <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    Broker Profile
                </button>
            </Link>

            <h1 className="text-2xl font-bold text-center mb-6">Broker Profile</h1>

            {loading ? (
                <p className="text-center text-lg text-gray-500">Loading data...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data && data.length > 0 ? (
                        data.map((broker, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col items-center"
                            >
                                {/* Display image */}
                                {editIndex === index ? (
                                    <>
                                        {/* Image upload input */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="mb-4"
                                        />
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-full mb-4"
                                            />
                                        ) : (
                                            <img
                                                src={broker.photo ? `https://bank.infiscripts.com/${broker.photo}` : 'https://via.placeholder.com/100'}
                                                alt="Broker"
                                                className="w-24 h-24 object-cover rounded-full mb-4"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <img
                                        src={broker.photo ? `https://bank.infiscripts.com/${broker.photo}` : 'https://via.placeholder.com/100'}
                                        alt="Broker1"
                                        className="w-24 h-24 object-cover rounded-full mb-4"
                                    />
                                )}

                                {/* Conditionally render input fields for editing */}
                                {editIndex === index ? (
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedBroker.name || broker.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <input
                                            type="email"
                                            name="email_or_phone"
                                            value={editedBroker.email_or_phone || broker.email_or_phone}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="parentID"
                                            value={editedBroker.parentID || broker.parentID}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="Company"
                                            value={editedBroker.Company || broker.Company}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="dealer_type"
                                            value={editedBroker.dealer_type || broker.dealer_type}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="district"
                                            value={editedBroker.district || broker.district}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="address"
                                            value={editedBroker.address || broker.address}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editedBroker.phone || broker.phone}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                                        />
                                        <button
                                            className="bg-green-500 text-white p-2 rounded-md mt-2 hover:bg-green-700"
                                            onClick={() => handleSave(index)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm text-gray-600">{broker.email_or_phone || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Parent ID: {broker.parentID || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Company: {broker.Company || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Dealer Type: {broker.dealer_type || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">District: {broker.district || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Address: {broker.address || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">Phone: {broker.phone || 'N/A'}</p>
                                        <button
                                            className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                                            onClick={() => {
                                                setEditIndex(index);
                                                setEditedBroker(broker); // Pre-fill form with existing data
                                                setImagePreview(null); // Reset image preview
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}

                                {/* Add Credits Section */}
                                <div className="mt-4 w-full flex items-center gap-4">
                                    <div className="w-full">
                                        <input
                                            type="number"
                                            id={`credits-${index}`}
                                            placeholder="Enter credits"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <button
                                        className="bg-pink-300 text-white p-2 rounded-md hover:bg-pink-600"
                                        onClick={() => alert(`Credits added for broker ${broker.name}`)}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-lg text-gray-500">No data available</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default BrokerProfile;

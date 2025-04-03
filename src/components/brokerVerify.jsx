import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BrokerVerify() {
  const [brokers, setBrokers] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Track which broker is being edited
  const [newCredits, setNewCredits] = useState(''); // Store new credits value
  const [successMessage, setSuccessMessage] = useState(''); // Store success message

  useEffect(() => {
    // Fetching data from the API
    axios
      .get('https://bank.infiscripts.com/broker-dealers.php')
      .then((response) => {
        if (response.data.status === 'success') {
          setBrokers(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching broker data:', error);
      });
  }, []);

  const handleEdit = (broker) => {
    setIsEditing(broker.id); // Start editing the broker with this ID
    setNewCredits(broker.creditsverified); // Set the initial credits value
  };

  const handleSave = (broker) => {
    // Post the updated data to the API
    axios
      .post('https://bank.infiscripts.com/adminbrokercredit.php', {
        owner: broker.email_or_phone, // Use email or phone
        creditsverified: newCredits, // Updated credits value
      })
      .then((response) => {
        if (response.data.status === 'success') {
          setBrokers(
            brokers.map((b) =>
              b.id === broker.id ? { ...b, creditsverified: newCredits } : b
            )
          );
          setSuccessMessage('Broker updated successfully!'); // Set success message
          setIsEditing(null); // Stop editing after save
        } else {
          setSuccessMessage('Failed to update broker.');
        }
      })
      .catch((error) => {
        console.error('Error saving broker data:', error);
        setSuccessMessage('Error saving broker data.');
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Broker Profile</h1>
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 mb-4 rounded">
          {successMessage}
        </div>
      )}
      <ul>
        {brokers
          .filter(
            (broker) => broker.creditsverified !== null && broker.upitrasnaction !== null
          )
          .map((broker) => (
            <li key={broker.id} className="mb-4">
              <p className="font-semibold">Name: {broker.name}</p>
              <p>Email or Phone: {broker.email_or_phone}</p>
              <div className="mt-2">
                <p>Credits Verified: </p>
                {isEditing === broker.id ? (
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(e.target.value)}
                    className="border p-2 mt-1 rounded"
                  />
                ) : (
                  <p>{broker.creditsverified}</p>
                )}
              </div>
              <p>UPI Transaction: {broker.upitrasnaction}</p>

              <div className="mt-2">
                {isEditing === broker.id ? (
                  <button
                    onClick={() => handleSave(broker)}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(broker)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default BrokerVerify;

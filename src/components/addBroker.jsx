import React, { useState, useEffect } from "react";
import axios from "axios";

const BrokerDetails = () => {
  const [brokerDetails, setBrokerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    dealerType: "",
    district: "",
    address: "",
    dealerId: "",
    subDealerId: "", // Add subDealerId to state
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [dealerIds, setDealerIds] = useState([]); // Dealer IDs for "Sub Dealer"
  const [subDealerIds, setSubDealerIds] = useState([]); // Sub Dealer IDs for "Sub-Sub Dealer"

  useEffect(() => {
    if (brokerDetails.dealerType === "Sub Dealer") {
      fetchDealerIds(); // Fetch dealer IDs when "Sub Dealer" is selected
    } else if (brokerDetails.dealerType === "Sub-Sub Dealer") {
      fetchSubDealerIds(); // Fetch sub-dealer IDs when "Sub-Sub Dealer" is selected
    } else {
      setDealerIds([]); // Clear dealer IDs when dealerType is not "Sub Dealer"
      setSubDealerIds([]); // Clear sub-dealer IDs when dealerType is not "Sub-Sub Dealer"
    }
  }, [brokerDetails.dealerType]);

  // Fetch dealer IDs from the API
  const fetchDealerIds = async () => {
    try {
      const response = await axios.get("http://localhost/broker/addBroker.php");
      if (response.data.status === "success") {
        const filteredDealers = response.data.data.filter(
          (dealer) => dealer.dealerType === "Dealer"
        );
        setDealerIds(filteredDealers); // Update state with filtered dealers
      } else {
        setMessage("Failed to load dealer IDs.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error fetching dealer IDs:", error);
      setMessage("Failed to load dealer IDs.");
      setMessageType("error");
    }
  };

  // Fetch sub-dealer IDs from the API
  const fetchSubDealerIds = async () => {
    try {
      const response = await axios.get("http://localhost/broker/addBroker.php");
      if (response.data.status === "success") {
        const filteredSubDealers = response.data.data.filter(
          (dealer) => dealer.dealerType === "Sub Dealer"
        );
        setSubDealerIds(filteredSubDealers); // Update state with filtered sub-dealers
      } else {
        setMessage("Failed to load sub-dealer IDs.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error fetching sub-dealer IDs:", error);
      setMessage("Failed to load sub-dealer IDs.");
      setMessageType("error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrokerDetails({ ...brokerDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!brokerDetails.name || !brokerDetails.email || !brokerDetails.phone || !brokerDetails.dealerType) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/broker/addBroker.php",
        brokerDetails,
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message);
      setMessageType(response.data.status === "success" ? "success" : "error");

      if (response.data.status === "success") {
        setBrokerDetails({
          name: "",
          email: "",
          phone: "",
          company: "",
          dealerType: "",
          district: "",
          address: "",
          dealerId: "",
          subDealerId: "", // Reset sub-dealer ID when the form is reset
        });
      }
    } catch (error) {
      setMessage("Failed to save broker details.");
      setMessageType("error");
      console.error(error);
    }
  };

  return (
    <div className="animated-container">
      <div className="animated-card">
        <h2 className="animated-title">Add Broker</h2>

        <form onSubmit={handleSubmit} className="animated-form">
          {/* Name */}
          <div className="input-container">
            <input
              type="text"
              name="name"
              value={brokerDetails.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="animated-input"
            />
          </div>

          {/* Email */}
          <div className="input-container">
            <input
              type="email"
              name="email"
              value={brokerDetails.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="animated-input"
            />
          </div>

          {/* Phone */}
          <div className="input-container">
            <input
              type="text"
              name="phone"
              value={brokerDetails.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="animated-input"
            />
          </div>

          {/* Company */}
          <div className="input-container">
            <input
              type="text"
              name="company"
              value={brokerDetails.company}
              onChange={handleChange}
              placeholder="Company Name"
              className="animated-input"
            />
          </div>

          {/* Dealer Type */}
          <div className="input-container">
            <select
              name="dealerType"
              value={brokerDetails.dealerType}
              onChange={handleChange}
              className="animated-input"
              placeholder="Select Dealer Type"
              required
            >
              <option value="" disabled>Select Dealer Type</option>
              <option value="Dealer">Dealer</option>
              <option value="Sub Dealer">Sub Dealer</option>
              <option value="Sub-Sub Dealer">Sub-Sub Dealer</option>
            </select>
          </div>

          {/* Dealer ID for Sub Dealer */}
          {brokerDetails.dealerType === "Sub Dealer" && (
            <div className="input-container">
              <select
                name="dealerId"
                value={brokerDetails.dealerId}
                onChange={handleChange}
                className="animated-input"
                required
              >
                <option value="" disabled>Select Dealer ID</option>
                {dealerIds.length > 0 ? (
                  dealerIds.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name} - ({dealer.id})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No dealers found</option>
                )}
              </select>
            </div>
          )}

          {/* Sub Dealer ID for Sub-Sub Dealer */}
          {brokerDetails.dealerType === "Sub-Sub Dealer" && (
            <div className="input-container">
              <select
                name="subDealerId"
                value={brokerDetails.subDealerId}
                onChange={handleChange}
                className="animated-input"
                required
              >
                <option value="" disabled>Select Sub Dealer ID</option>
                {subDealerIds.length > 0 ? (
                  subDealerIds.map((subDealer) => (
                    <option key={subDealer.id} value={subDealer.id}>
                      {subDealer.name} - ({subDealer.id})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No sub-dealers found</option>
                )}
              </select>
            </div>
          )}


          {/* District */}
          <div className="input-container">
            <input
              type="text"
              name="district"
              value={brokerDetails.district}
              onChange={handleChange}
              placeholder="District"
              className="animated-input"
              required
            />
          </div>

          <div className="input-container">
            <textarea
              name="address"
              value={brokerDetails.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="animated-textarea"
            />
          </div>

          {/* Message Display */}
          {message && (
            <div className={`message ${messageType}`}>{message}</div>
          )}

          {/* Submit Button */}
          <button type="submit" className="animated-submit-button">
            Add Broker
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrokerDetails;

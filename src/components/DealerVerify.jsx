import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BrokerDealers = () => {
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dealerTypes, setDealerTypes] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedDealerType, setSelectedDealerType] = useState("All");
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealersWithCredits, setDealersWithCredits] = useState([]);
  const [showCredits, setShowCredits] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://bank.infiscripts.com/broker-dealers.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setDealers(data.data);
          setFilteredDealers(data.data);
          const uniqueDistricts = [...new Set(data.data.map(dealer => dealer.district))];
          setDistricts(uniqueDistricts);

          const uniqueDealerTypes = [...new Set(data.data.map(dealer => dealer.dealer_type))];
          setDealerTypes(uniqueDealerTypes);

          const creditDealers = data.data.filter(dealer => dealer.creditsverified !== null && dealer.creditsverified > 0);
          setDealersWithCredits(creditDealers);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    filterDealers(district, selectedDealerType, searchTerm);
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedDealerType(type);
    filterDealers(selectedDistrict, type, searchTerm);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterDealers(selectedDistrict, selectedDealerType, term);
  };

  const filterDealers = (district, dealerType, term) => {
    let updatedDealers = dealers;

    if (district !== "All") {
      updatedDealers = updatedDealers.filter(dealer => dealer.district === district);
    }

    if (dealerType !== "All") {
      updatedDealers = updatedDealers.filter(dealer => dealer.dealer_type === dealerType);
    }

    if (term) {
      updatedDealers = updatedDealers.filter(dealer => dealer.name.toLowerCase().includes(term));
    }

    setFilteredDealers(updatedDealers);
  };

  const updateCredits = async (dealerId) => {
    try {
      const response = await fetch("https://bank.infiscripts.com/broker-dealers.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: dealerId }),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert(`Credits updated successfully. New Credits: ${data.new_credits}`);
        window.location.reload(); // Refresh to reflect changes
      } else {
        alert("Error updating credits: " + data.message);
      }
    } catch (error) {
      console.error("Error updating credits:", error);
      alert("Failed to update credits.");
    }
  };

  const handleVerifyCredits = (dealer) => {
    if (dealer.creditsverified > 0) {
      updateCredits(dealer.id);
    } else {
      alert("No verified credits to update");
    }
  };

  return (
    <div className="p-4">
      <Link to="/brokerlist">
        <button className="add-broker-button mb-4 p-2 bg-blue-500 text-white rounded">
          Add Dealer
        </button>
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 mt-10">
        <h2 className="text-2xl font-bold">Dealers List</h2>
        <button
          className="p-2 mb-4 md:mb-0 bg-green-500 text-white rounded relative"
          onClick={() => setShowCredits(!showCredits)}
        >
          {showCredits ? "Hide Credits" : "Show Credits"}
          {dealersWithCredits.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>}
        </button>
      </div>

      {showCredits && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-96 overflow-y-auto flex flex-col">
            <h3 className="text-xl font-bold mb-2">Dealers with Verified Credits</h3>
            <ul className="list-disc pl-5 flex-grow">
              {dealersWithCredits.length > 0 ? (
                dealersWithCredits.map((dealer, index) => (
                  <li key={index} className="mb-1 font-semibold text-blue-700">{dealer.id}: {dealer.name} - Credits Verified: {dealer.creditsverified}</li>
                ))
              ) : (
                <p>No dealers with verified credits available.</p>
              )}
            </ul>
            <button
              onClick={() => setShowCredits(false)}
              className="mt-4 p-2 bg-red-500 text-white rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="font-semibold">Filter by District: </label>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="ml-2 p-2 border rounded"
        >
          <option value="All">All</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Filter by Dealer Type: </label>
        <select
          value={selectedDealerType}
          onChange={handleTypeChange}
          className="ml-2 p-2 border rounded"
        >
          <option value="All">All</option>
          {dealerTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Search by Name: </label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter dealer name..."
          className="ml-2 p-2 border rounded w-full md:w-64"
        />
      </div>

      <p className="mb-2 text-gray-600">Search Term: <strong>{searchTerm || "None"}</strong></p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDealers.map((dealer, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md flex flex-col md:flex-row">
            <img
              src={`https://bank.infiscripts.com/${dealer.photo}`}
              alt={dealer.name}
              className="w-full h-32 object-contain rounded mb-4 md:mb-0 md:w-1/3 md:h-32 md:rounded-l"
            />
            <div className="ml-0 md:ml-4 flex-1">
              <h3 className="text-xl font-semibold">{dealer.name}</h3>
              <p><strong>Dealer Type:</strong> {dealer.dealer_type}</p>
              <p><strong>District:</strong> {dealer.district}</p>
              <button
                onClick={() => setSelectedDealer(dealer)}
                className="mt-2 p-2 bg-blue-400 text-white rounded">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDealer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-96 overflow-y-auto flex flex-col">
            <h2 className="text-2xl font-bold mb-2">{selectedDealer.name}</h2>
            <img
              src={`https://bank.infiscripts.com/${selectedDealer.photo}`}
              alt={selectedDealer.name}
              className="w-full h-52 object-contain rounded"
            />
            <p><strong>Email/Phone:</strong> {selectedDealer.email_or_phone}</p>
            <p><strong>Company:</strong> {selectedDealer.Company || "N/A"}</p>
            <p><strong>Dealer Type:</strong> {selectedDealer.dealer_type}</p>
            <p><strong>District:</strong> {selectedDealer.district}</p>
            <p><strong>Address:</strong> {selectedDealer.address}</p>
            <p><strong>Phone:</strong> {selectedDealer.phone}</p>
            <p><strong>Credits:</strong> {selectedDealer.credits}</p>
            <p><strong>Credits Verified:</strong> {selectedDealer.creditsverified !== null ? selectedDealer.creditsverified : "N/A"}</p>
            <p><strong>UPI Transaction:</strong> {selectedDealer.upitrasnaction !== null ? selectedDealer.upitrasnaction : "N/A"}</p>
            <button
              onClick={() => handleVerifyCredits(selectedDealer)}
              className="mt-2 p-2 bg-purple-500 text-white rounded"
            >
              Move Verified Credits
            </button>
            <button
              onClick={() => setSelectedDealer(null)}
              className="mt-4 p-2 bg-red-500 text-white rounded w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerDealers;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await axios.get('https://bank.infiscripts.com/broker-dealers.php');
        if (response.data.status === 'success') {
          setDealers(response.data.data);
        } else {
          alert('Failed to fetch broker dealers.');
        }
      } catch (error) {
        console.error('Error fetching broker dealers:', error);
        alert('An error occurred while fetching broker dealers.');
      }
    };
    fetchDealers();
  }, []);


  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      <Link to="/brokerlist">
        <button className="add-broker-button mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow">
          Add Broker
        </button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">Broker List</h1>

      <div className="container mx-auto">
        {dealers.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email/Phone</th>
                <th className="border border-gray-300 px-4 py-2">Parent ID</th>
                <th className="border border-gray-300 px-4 py-2">Photo</th>
                <th className="border border-gray-300 px-4 py-2">Company</th>
                <th className="border border-gray-300 px-4 py-2">Dealer Type</th>
                <th className="border border-gray-300 px-4 py-2">District</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Credits Verified</th>
                <th className="border border-gray-300 px-4 py-2">UPI Transaction</th>
                <th className="border border-gray-300 px-4 py-2">Credits</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((dealer, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-300"
                >
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.name || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.email_or_phone || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.parentID || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-gray-700">
                    {dealer.photo ? (
                      <img
                        src={`https://bank.infiscripts.com/${dealer.photo}`} // Correct absolute URL
                        alt="Dealer"
                        className="h-20 w-20 rounded-lg object-cover" // Increased size (h-20 w-20)
                        onError={(e) => (e.target.src = "/default-profile.png")} // Fallback image
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>



                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.Company || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.dealer_type || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.district || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.address || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.phone || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.creditsverified === "1" ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.upitrasnaction || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700">
                    {dealer.credits || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No broker dealers available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;

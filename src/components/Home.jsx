import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://bank.infiscripts.com/broker-dealers.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setBrokers(data.data);
          setFilteredBrokers(data.data);

          // Extract unique districts
          const uniqueDistricts = [
            ...new Set(data.data.map((broker) => broker.district)),
          ].filter((district) => district); // Remove undefined/null
          setDistricts(uniqueDistricts);
        }
      })
      .catch((error) => console.error('Error fetching broker data:', error));
  }, []);

  const handleRowClick = (brokerId) => {
    navigate(`/broker-details/${brokerId}`, { state: { brokerId } });
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter brokers by email_or_phone
    const filtered = brokers.filter(
      (broker) =>
        broker.email_or_phone?.toLowerCase().includes(value)
    );

    // Apply district filter if selected
    setFilteredBrokers(
      selectedDistrict
        ? filtered.filter((broker) => broker.district === selectedDistrict)
        : filtered
    );
  };

  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);

    // Filter brokers by district
    const filtered = brokers.filter((broker) =>
      district ? broker.district === district : true
    );

    // Apply search filter if necessary
    setFilteredBrokers(
      searchTerm
        ? filtered.filter(
          (broker) =>
            broker.email_or_phone?.toLowerCase().includes(searchTerm)
        )
        : filtered
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/brokerlist">
        <button className="add-broker-button">Add Dealer</button>
      </Link>

      <h1 className='font-bold text-2xl text-center mb-2 text-teal-500'>Dealer List</h1>

      {/* District Dropdown */}
      <div className="flex gap-4 items-center mb-4">
        {/* District Dropdown */}
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="flex-1 p-2 border border-gray-300 rounded-md text-lg"
        >
          <option value="">All Districts</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by email or phone..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-2 p-2 border border-gray-300 rounded-md text-lg w-full"
        />
      </div>


      <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email or Phone</th>
            <th>Company</th>
            <th>Dealer Type</th>
            <th>District</th>
            <th>Address</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          {filteredBrokers.map((broker, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(index)}
              style={{ cursor: 'pointer', backgroundColor: '#f9f9f9' }}
            >
              <td>{broker.name || 'N/A'}</td>
              <td>{broker.email_or_phone || 'N/A'}</td>
              <td>{broker.Company || 'N/A'}</td>
              <td>{broker.dealer_type || 'N/A'}</td>
              <td>{broker.district || 'N/A'}</td>
              <td>{broker.address || 'N/A'}</td>
              <td>{broker.credits || '0'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;

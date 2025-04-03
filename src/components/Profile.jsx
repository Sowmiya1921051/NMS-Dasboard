import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState(
    localStorage.getItem('verificationMessage') || ''
  );

  useEffect(() => {
    axios
      .get('http://localhost/broker/addBroker.php')
      .then((response) => {
        setProfileData(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const handleVerify = (id, currentStatus) => {
    const newStatus = !currentStatus;

    axios
      .put('http://localhost/broker/addBroker.php', {
        id,
        verified: newStatus,
      })
      .then((response) => {
        if (response.data.status === 'success') {
          setProfileData((prevData) =>
            prevData.map((profile) =>
              profile.id === id ? { ...profile, verified: newStatus } : profile
            )
          );

          setVerificationMessage('Verification Done!');
          localStorage.setItem('verificationMessage', 'Verification Done!');
        } else {
          console.error('Error:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error updating verification status:', error);
      });
  };

  const getVerifiedCount = () => {
    return profileData ? profileData.filter((profile) => profile.verified).length : 0;
  };

  const getUnverifiedCount = () => {
    return profileData ? profileData.filter((profile) => !profile.verified).length : 0;
  };

  const getVerifiedSubDealerCount = () => {
    return profileData
      ? profileData.filter((profile) => profile.dealerType === 'Sub Dealer' && profile.verified).length
      : 0;
  };

  const getUnverifiedSubDealerCount = () => {
    return profileData
      ? profileData.filter((profile) => profile.dealerType === 'Sub Dealer' && !profile.verified).length
      : 0;
  };

  const getVerifiedSubDealerProfiles = () => {
    return profileData
      ? profileData.filter(
          (profile) => profile.dealerType === 'Sub Dealer' && profile.verified
        )
      : [];
  };

  const getUnverifiedSubDealerProfiles = () => {
    return profileData
      ? profileData.filter(
          (profile) => profile.dealerType === 'Sub Dealer' && !profile.verified
        )
      : [];
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-heading">Profile List</h1>

      <div className="verified-count-container">
        <button className="button-33">
          Verified Profiles: {getVerifiedCount()}
        </button>
      </div>

      {profileData && profileData.length > 0 ? (
        <table className="profile-table">
          <thead>
            <tr className="profile-table-header">
              <th className="profile-table-cell">Name</th>
              <th className="profile-table-cell">Email</th>
              <th className="profile-table-cell">Phone</th>
              <th className="profile-table-cell">Company</th>
              <th className="profile-table-cell">Dealer Type</th>
              <th className="profile-table-cell">District</th>
              <th className="profile-table-cell">Address</th>
              <th className="profile-table-cell">Verified</th>
              <th className="profile-table-cell">Credit Points</th>
              <th className="profile-table-cell">Created At</th>
            </tr>
          </thead>
          <tbody>
            {profileData.map((profile) => (
              <tr key={profile.id} className="profile-table-row">
                <td className="profile-table-cell">{profile.name}</td>
                <td className="profile-table-cell">{profile.email}</td>
                <td className="profile-table-cell">{profile.phone}</td>
                <td className="profile-table-cell">{profile.company}</td>
                <td className="profile-table-cell">{profile.dealerType}</td>
                <td className="profile-table-cell">{profile.district}</td>
                <td className="profile-table-cell">{profile.address}</td>
                <td className="profile-table-cell">
                  <button
                    className={`verify-button ${
                      profile.verified ? 'verified' : 'unverified'
                    }`}
                    onClick={() => handleVerify(profile.id, profile.verified)}
                    disabled={profile.verified} // Disable button if already verified
                  >
                    {profile.verified ? 'Verification Done' : 'Verify'}
                  </button>
                </td>
                <td className="profile-table-cell">{profile.credit_points}</td>
                <td className="profile-table-cell">{profile.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="profile-no-data">No profiles found</div>
      )}

      {/* Display Unverified Sub-Dealer Count */}
      <div className="unverified-subdealer-count-container">
        <button className="button-33">
          New Profiles: {getUnverifiedSubDealerCount()}
        </button>
      </div>

      {/* Display Unverified Sub-Dealer Details */}
      {getUnverifiedSubDealerProfiles().length > 0 && (
        <div className="subdealer-section">
          <h2 className="subdealer-heading">New profiles</h2>
          <table className="subdealer-table">
            <thead>
              <tr className="subdealer-table-header">
                <th className="subdealer-table-cell">Name</th>
                <th className="subdealer-table-cell">Email</th>
                <th className="subdealer-table-cell">Phone</th>
                <th className="subdealer-table-cell">Company</th>
                <th className="subdealer-table-cell">Created At</th>
              </tr>
            </thead>
            <tbody>
              {getUnverifiedSubDealerProfiles().map((profile) => (
                <tr key={profile.id} className="subdealer-table-row">
                  <td className="subdealer-table-cell">{profile.name}</td>
                  <td className="subdealer-table-cell">{profile.email}</td>
                  <td className="subdealer-table-cell">{profile.phone}</td>
                  <td className="subdealer-table-cell">{profile.company}</td>
                  <td className="subdealer-table-cell">{profile.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display Verified Sub-Dealer Count */}
      <div className="verified-subdealer-count-container">
        <button className="button-33">
          Old Profiles: {getVerifiedSubDealerCount()}
        </button>
      </div>

      {/* Display Verified Sub-Dealer Details */}
      {getVerifiedSubDealerProfiles().length > 0 && (
        <div className="subdealer-section">
          <h2 className="subdealer-heading">Old Profiles</h2>
          <table className="subdealer-table">
            <thead>
              <tr className="subdealer-table-header">
                <th className="subdealer-table-cell">Name</th>
                <th className="subdealer-table-cell">Email</th>
                <th className="subdealer-table-cell">Phone</th>
                <th className="subdealer-table-cell">Company</th>
                <th className="subdealer-table-cell">Created At</th>
              </tr>
            </thead>
            <tbody>
              {getVerifiedSubDealerProfiles().map((profile) => (
                <tr key={profile.id} className="subdealer-table-row">
                  <td className="subdealer-table-cell">{profile.name}</td>
                  <td className="subdealer-table-cell">{profile.email}</td>
                  <td className="subdealer-table-cell">{profile.phone}</td>
                  <td className="subdealer-table-cell">{profile.company}</td>
                  <td className="subdealer-table-cell">{profile.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
    </div>
  );
}

export default Profile;

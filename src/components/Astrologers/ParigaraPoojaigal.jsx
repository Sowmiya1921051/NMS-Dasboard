import { useEffect, useState } from 'react';

const ParigaraPoojaigal = () => {
  const [astroData, setAstroData] = useState([]);
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [newAstro, setNewAstro] = useState({
    name: '',
    mobile_number: '',
    email: '',
    city: '',
    district: '',
    experience: '',
    gender: '',
    education_qualification: '',
    facebook_link: '',
    language: '',
    additional_details: '',
    image: null,
  });

  // Fetch data from the rajanilai API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://bank.infiscripts.com/rajanilai.php');
        const result = await response.json();
        if (result.status === 'success') {
          setAstroData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Add new astrologer and update UI instantly
  const handleAddAstrologer = async () => {
    const formData = new FormData();
    Object.keys(newAstro).forEach((key) => {
      formData.append(key, newAstro[key]);
    });

    try {
      const response = await fetch('https://bank.infiscripts.com/rajanilai.php', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.status === 'success') {
        // Instantly display newly uploaded image
        const newEntryWithImage = {
          ...newAstro,
          image_path: URL.createObjectURL(newAstro.image),
          id: Date.now(),
        };

        setAstroData((prev) => [...prev, newEntryWithImage]);
        setIsInputVisible(false);
        alert('Astrologer added successfully');
      } else {
        alert('Error adding astrologer: ' + result.message);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAstro((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAstro((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ParigaraPoojaigal Data</h1>

      {/* Add New Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => setIsInputVisible(true)}
      >
        Add ParigaraPoojaigal
      </button>

      {/* Input Form Modal */}
      {isInputVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] h-[500px] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Add New ParigaraPoojaigal</h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(newAstro).map((key) => (
                <div key={key}>
                  <label className="block text-gray-700 mb-1 capitalize">{key.replace('_', ' ')}</label>
                  {key === 'gender' ? (
                    <select
                      name="gender"
                      value={newAstro.gender}
                      onChange={handleInputChange}
                      className="p-2 border rounded-lg w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : key === 'image' ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="p-2 border rounded-lg w-full"
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={newAstro[key]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${key.replace('_', ' ')}`}
                      className="p-2 border rounded-lg w-full"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleAddAstrologer}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Submit
              </button>
              <button
                onClick={() => setIsInputVisible(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {astroData.map((astro) => (
          <div
            key={astro.id}
            className="border rounded-lg p-4 shadow-lg cursor-pointer"
            onClick={() => setSelectedAstro(astro)}
          >
            {astro.image_path && (
              <img
                src={astro.image_path.startsWith('blob:')
                  ? astro.image_path
                  : `https://bank.infiscripts.com/${astro.image_path}`}
                alt={astro.name}
                className="w-full h-40 object-contain mb-4 rounded-md"
              />
            )}
            <h2 className="text-xl font-semibold">{astro.name}</h2>
            <p className="text-gray-700">Mobile: {astro.mobile_number}</p>
            <p className="text-gray-700">District: {astro.district}</p>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedAstro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">{selectedAstro.name}</h2>
            {Object.entries(selectedAstro).map(([key, value]) => (
              value && (
                <p key={key} className="text-gray-700 capitalize">
                  {key.replace('_', ' ')}: {value}
                </p>
              )
            ))}
            <button
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => setSelectedAstro(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParigaraPoojaigal;

import { useEffect, useState, memo } from 'react';

const DressShops = () => {
  const [hallData, setHallData] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [newHall, setNewHall] = useState({
    name: '',
    phone_number: '',
    address: '',
    experience: '',
    image: null,
    imagePreview: null,
  });

  // Fetch hall data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://bank.infiscripts.com/dress.php');
        const result = await response.json();
        if (result.status === 'success') setHallData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle input changes without causing unnecessary re-renders
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHall((prev) => {
      if (prev[name] === value) return prev; // Avoid redundant updates
      return { ...prev, [name]: value };
    });
  };

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewHall((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Add new hall
  const handleAddHall = async () => {
    const formData = new FormData();
    Object.entries(newHall).forEach(([key, value]) => {
      formData.append(key === 'experience' ? 'note' : key, value);
    });

    try {
      const response = await fetch('https://bank.infiscripts.com/dress.php', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.status === 'success') {
        setHallData((prev) => [
          ...prev,
          {
            ...newHall,
            id: Date.now(), // Temporary ID
            image: newHall.imagePreview, // Use the preview immediately
            note: newHall.experience, // Map "experience" to "note"
          },
        ]);
        alert('DressShops added successfully');
        resetForm();
      } else {
        alert('Error adding hall: ' + result.message);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setIsInputVisible(false);
    setNewHall({
      name: '',
      phone_number: '',
      address: '',
      experience: '',
      image: null,
      imagePreview: null,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dress Shops Data</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => setIsInputVisible(true)}
      >
        Add Dress Shops
      </button>

      {isInputVisible && (
        <HallInput
          newHall={newHall}
          handleInputChange={handleInputChange}
          handleImageUpload={handleImageUpload}
          handleAddHall={handleAddHall}
          resetForm={resetForm}
        />
      )}

      {selectedHall && (
        <HallDetails hall={selectedHall} close={() => setSelectedHall(null)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hallData.map((hall) => (
          <div
            key={hall.id}
            className="border rounded-lg p-4 shadow-lg cursor-pointer"
            onClick={() => setSelectedHall(hall)}
          >
            {hall.image && (
              <img
                src={
                  hall.image.startsWith('blob:')
                    ? hall.image
                    : `https://bank.infiscripts.com/${hall.image}`
                }
                alt={hall.name}
                className="w-full h-40 object-contain mb-4 rounded-md"
              />
            )}
            <h2 className="text-xl font-semibold">{hall.name}</h2>
            <p className="text-gray-700">Phone: {hall.phone_number}</p>
            <p className="text-gray-700">Address: {hall.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hall Input Component (Memoized to prevent re-renders)
// eslint-disable-next-line react/display-name
const HallInput = memo(({ newHall, handleInputChange, handleImageUpload, handleAddHall, resetForm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] h-[500px] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Dress Shops</h2>
      {['name', 'phone_number', 'address', 'experience'].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-gray-700 mb-1">{field.replace('_', ' ').toUpperCase()}</label>
          <input
            type="text"
            name={field}
            value={newHall[field]}
            onChange={handleInputChange}
            placeholder={`Enter ${field}`}
            className="p-2 border rounded-lg w-full"
          />
        </div>
      ))}
      <label className="block text-gray-700 mb-1">Image</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 border rounded-lg w-full" />
      {newHall.imagePreview && (
        <img src={newHall.imagePreview} alt="Preview" className="mt-4 w-40 h-40 object-cover rounded-lg" />
      )}
      <div className="mt-4 flex justify-end space-x-4">
        <button onClick={handleAddHall} className="px-4 py-2 bg-green-500 text-white rounded-lg">Submit</button>
        <button onClick={resetForm} className="px-4 py-2 bg-red-500 text-white rounded-lg">Cancel</button>
      </div>
    </div>
  </div>
));

// Hall Details Component (Memoized to prevent re-renders)
// eslint-disable-next-line react/display-name
const HallDetails = memo(({ hall, close }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] h-[300px] overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Hall Details</h2>
      {['name', 'phone_number', 'address'].map((key) => (
        <p key={key}><strong>{key.replace('_', ' ').toUpperCase()}:</strong> {hall[key]}</p>
      ))}
      <p><strong>Experience:</strong> {hall.note}</p>
      <button onClick={close} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Close</button>
    </div>
  </div>
));

export default DressShops;

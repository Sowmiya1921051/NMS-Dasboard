import React, { useState } from 'react';
import axios from 'axios';

const BrokerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email_or_phone: '',
    password: '',
    parentID: '',
    company: '',
    dealer_type: '',
    district: '',
    address: '',
    phone: '',
    photo: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const [popupMessage, setPopupMessage] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle photo upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));

    try {
      const response = await axios.post(
        'https://bank.infiscripts.com/broker-dealers.php',
        formPayload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      showSuccessPopup(response.data.message || 'Form submitted successfully!');
      resetForm();
    } catch (error) {
      showSuccessPopup('Error occurred while submitting the form.');
    }
  };

  // Show the success/error popup
  const showSuccessPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000); // Hide popup after 5 seconds
  };

  // Navigate between form steps
  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1);

  // Reset the form
  const resetForm = () => {
    setFormData({
      name: '',
      email_or_phone: '',
      password: '',
      parentID: '',
      company: '',
      dealer_type: '',
      district: '',
      address: '',
      phone: '',
      photo: null,
    });
    setCurrentStep(1);
  };

  // Form steps and fields
  const steps = [
    {
      title: 'Personal Details',
      fields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email_or_phone', label: 'Email or Phone', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
      ],
    },
    {
      title: 'Business Details',
      fields: [
        { name: 'parentID', label: 'Branch Code', type: 'text' },
        { name: 'company', label: 'Branch Name', type: 'text' },
        {
          name: 'dealer_type',
          label: 'Dealer Type',
          type: 'select',
          options: ['Dealer', 'Sub Dealer', 'District Dealer'],
        },
      ],
    },
    {
      title: 'Contact Details',
      fields: [
        { name: 'district', label: 'District', type: 'text' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'photo', label: 'Upload Photo', type: 'file' },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg relative">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">Dealer Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {steps.map((step, index) => (
          currentStep === index + 1 && (
            <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">{step.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {step.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-700 font-medium mb-1">{field.label}:</label>
                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.type === 'file' ? undefined : formData[field.name]}
                        onChange={field.type === 'file' ? handleFileChange : handleChange}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition focus:outline-none"
                  >
                    Previous
                  </button>
                )}
                {index < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition focus:outline-none"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition focus:outline-none"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )
        ))}
      </form>

      {/* Success/Error Popup */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 p-4 bg-green-500 text-white rounded-lg shadow-lg z-50 transition-opacity duration-300 ease-in-out">
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default BrokerForm;

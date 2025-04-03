import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaCamera, FaShoppingBag, FaSpa, FaHotel, FaSeedling, FaPalette, FaRegAddressCard, FaTractor } from 'react-icons/fa';

const AtoZservices = () => {
  const services = [
    { name: 'Marriage Hall', path: '/Marraige-Hall', icon: <FaHotel /> },
    { name: 'Catering', path: '/Catering', icon: <FaUtensils /> },
    { name: 'Beautician', path: '/Beautician', icon: <FaSpa /> },
    { name: 'Dress Shops', path: '/Dress-Shops', icon: <FaShoppingBag /> },
    { name: 'Flower Service', path: '/Flower-Service', icon: <FaSeedling /> },
    { name: 'Stage Decoration', path: '/Stage-Decoration', icon: <FaPalette /> },
    { name: 'Photo & Video', path: '/Photo-And-Video', icon: <FaCamera /> },
    { name: 'Wedding Card', path: '/Wedding-Card', icon: <FaRegAddressCard /> },
    { name: 'Farmer', path: '/Farmer', icon: <FaTractor /> }, // ✅ Farmer Added
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-pink-400 drop-shadow-lg">
        A to Z Services
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <Link
            key={index}
            to={service.path}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-2xl hover:shadow-3xl transition-transform duration-500 transform hover:scale-105"
          >
            <div className="p-8 text-center">
              <div className="text-5xl text-pink-400 mb-6 transition-transform duration-500 group-hover:rotate-12">
                {service.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 group-hover:text-pink-300 transition-colors duration-300">
                {service.name}
              </h2>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-pink-400 transition-all duration-500 group-hover:h-3"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AtoZservices;

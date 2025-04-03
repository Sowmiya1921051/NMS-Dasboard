import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaGlobe, FaHome, FaHandPaper, FaCalculator, FaRobot, FaPrayingHands,
  FaStar, FaLeaf, FaScroll, FaInfinity
} from 'react-icons/fa';

const Astrologers = () => {
  const astrologers = [
    { name: 'Parambariyam', path: '/parambariyam', icon: <FaGlobe /> },
    { name: 'Vasthu', path: '/Vastu', icon: <FaHome /> },
    { name: 'Kairegai', path: '/Kairegai', icon: <FaHandPaper /> },
    { name: 'Numerology', path: '/numerology', icon: <FaCalculator /> },
    { name: 'Enthiram & Manthiram', path: '/enthiram-manthiram', icon: <FaRobot /> },
    { name: 'Parigara Poojaigal', path: '/parigara-poojaigal', icon: <FaPrayingHands /> },
    { name: 'KP Jothidam', path: '/kp-jothidam', icon: <FaStar /> },
    { name: 'Naadi', path: '/naadi', icon: <FaLeaf /> },
    { name: 'Olai Suvadi', path: '/olai-suvadi', icon: <FaScroll /> },
    { name: 'All in One Astrologer', path: '/all-in-one-astrologer', icon: <FaInfinity /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  p-4 sm:p-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-rose-500 drop-shadow-lg">
        🔮 Explore Our Astrologers 🔮
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {astrologers.map((astrologer, index) => (
          <Link
            key={index}
            to={astrologer.path}
            className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-pink-400/50 transition-all duration-500 transform hover:scale-105"
          >
            <div className="p-6 sm:p-8 text-center">
              <div className="text-4xl sm:text-5xl text-rose-500 mb-4 transition-all duration-500 group-hover:rotate-6">
                {astrologer.icon}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 group-hover:text-rose-400 transition-colors duration-300">
                {astrologer.name}
              </h2>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-rose-500 transition-all duration-500 group-hover:h-2"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Astrologers;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaHome, FaHandPaper, FaCalculator, FaRobot, FaPrayingHands, FaStar, FaLeaf, FaScroll, FaInfinity } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-br  p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-rose-400 drop-shadow-lg">
        🔮 Explore Our Astrologers 🔮
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {astrologers.map((astrologer, index) => (
          <Link
            key={index}
            to={astrologer.path}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-2xl hover:shadow-pink-500/50 transition-transform duration-500 transform hover:scale-105"
          >
            <div className="p-8 text-center">
              <div className="text-5xl text-rose-500 mb-6 transition-transform duration-500 group-hover:rotate-12">
                {astrologer.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 group-hover:text-rose-400 transition-colors duration-300">
                {astrologer.name}
              </h2>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-rose-500 transition-all duration-500 group-hover:h-3"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Astrologers;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Select, MenuItem } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    dealerCount: 0,
    subDealerCount: 0,
    districtDealerCount: 0,
    userCount: 0,
  });

  const [dealerDetails, setDealerDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupData, setPopupData] = useState([]);

  const [monthlyUserCounts, setMonthlyUserCounts] = useState(Array(31).fill(0));
  const [currentMonthUserCounts, setCurrentMonthUserCounts] = useState(Array(31).fill(0));
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://bank.infiscripts.com/adminview.php');
        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
          const userCountsByDay = Array(31).fill(0);
          const currentMonthCountsByDay = Array(31).fill(0);

          result.data.forEach((user) => {
            if (user.created_at) {
              const parsedDate = new Date(user.created_at.trim());
              if (!isNaN(parsedDate)) {
                const month = parsedDate.getMonth();
                const day = parsedDate.getDate();
                const year = parsedDate.getFullYear();

                if (month === selectedMonth && year === selectedYear) {
                  userCountsByDay[day - 1] += 1;
                }
                if (month === new Date().getMonth() && year === new Date().getFullYear()) {
                  currentMonthCountsByDay[day - 1] += 1;
                }
              } else {
                console.error(`Invalid date: ${user.created_at}`);
              }
            }
          });

          setMonthlyUserCounts(userCountsByDay);
          setCurrentMonthUserCounts(currentMonthCountsByDay);
        } else {
          console.error('Invalid data format for users');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [selectedMonth, selectedYear]);

  const isSameMonth =
    selectedMonth === new Date().getMonth() &&
    selectedYear === new Date().getFullYear();

  const dailyUserChartData = {
    labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: `Users in ${new Date(0, selectedMonth).toLocaleString('default', {
          month: 'long',
        })} ${selectedYear}`,
        data: monthlyUserCounts,
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 2,
      },
      !isSameMonth && {
        label: 'Users (Current Month)',
        data: currentMonthUserCounts,
        backgroundColor: '#FF7043',
        borderColor: '#F4511E',
        borderWidth: 2,
      },
    ].filter(Boolean),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly User Count by Day',
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brokerRes, userRes] = await Promise.all([
          fetch('https://bank.infiscripts.com/broker-dealers.php'),
          fetch('https://bank.infiscripts.com/adminview.php'),
        ]);

        const [brokerData, userData] = await Promise.all([
          brokerRes.json(),
          userRes.json(),
        ]);

        // Set Dealer Stats
        if (brokerData.data) {
          const counts = {
            dealerCount: brokerData.data.filter(b => b.dealer_type === 'Dealer').length,
            subDealerCount: brokerData.data.filter(b => b.dealer_type === 'Sub Dealer').length,
            districtDealerCount: brokerData.data.filter(b => b.dealer_type === 'District Dealer').length,
          };
          setStats(prev => ({ ...prev, ...counts }));
          setDealerDetails(brokerData.data);
        }

        // Set User Stats
        if (userData.data) {
          setStats(prev => ({ ...prev, userCount: userData.data.length }));
          setUserDetails(userData.data);

          // Calculate users per day for the chart
          const userCountsByDay = Array(31).fill(0);
          userData.data.forEach(user => {
            if (user.created_at) {
              const date = new Date(user.created_at.trim());
              if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
                userCountsByDay[date.getDate() - 1] += 1;
              }
            }
          });
          setMonthlyUserCounts(userCountsByDay);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleOpen = (type) => {
    setPopupTitle(type);

    if (type === 'Total Users') {
      setPopupData(userDetails.map(user => ({
        id: user.id,
        name: user.full_name || user.name || 'No Name',
        image: user.profile_pic ? `https://bank.infiscripts.com/${user.profile_pic}` : 'https://via.placeholder.com/50',
        contact: user.phone || user.email || 'No Contact',
      })));
    } else {
      const filteredDetails = dealerDetails
        .filter(dealer => dealer.dealer_type === type)
        .map(dealer => ({
          id: dealer.id,
          name: dealer.name || 'No Name',
          image: dealer.photo ? `https://bank.infiscripts.com/${dealer.photo}` : 'https://via.placeholder.com/50',
          contact: dealer.phone || dealer.email || 'No Contact',
        }));
      setPopupData(filteredDetails);
    }

    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const infoCards = [
    { label: 'Dealers', count: stats.dealerCount, gradient: 'from-green-400 to-green-600', type: 'Dealer' },
    { label: 'Sub Dealers', count: stats.subDealerCount, gradient: 'from-yellow-400 to-orange-500', type: 'Sub Dealer' },
    { label: 'District Dealers', count: stats.districtDealerCount, gradient: 'from-red-400 to-pink-500', type: 'District Dealer' },
    { label: 'Total Users', count: stats.userCount, gradient: 'from-blue-400 to-blue-600', type: 'Total Users' },
  ];

  return (
    <div className="p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center mb-4">
        <Link
          to="/verifiedProfile"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700"
        >
          Go to Users Profile
        </Link>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400 text-center md:text-left">
          Dashboard Overview
        </h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleOpen(card.type)}
            className={`bg-gradient-to-br ${card.gradient} p-6 rounded-xl shadow-lg text-center text-white cursor-pointer`}
          >
            <h3 className="text-lg font-semibold">{card.label}</h3>
            <p className="text-3xl font-bold">{card.count}</p>
          </div>
        ))}
      </div>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-xl" style={{ borderBottom: '4px solid #4A90E2' }}>
          {popupTitle} Details
        </DialogTitle>

        <DialogContent>
          <div className="space-y-4">
            {popupData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-800">{item.id}.</span>
                  <img
                    src={item.image || 'https://via.placeholder.com/50'}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="text-lg font-bold text-pink-600">{item.name}</span>
                </div>
                <span className="text-lg text-gray-600">{item.contact}</span>
              </div>
            ))}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mb-4 sm:mb-0"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <MenuItem key={i} value={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <MenuItem key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        <Bar data={dailyUserChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
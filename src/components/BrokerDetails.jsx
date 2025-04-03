import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function BrokerDetails() {
  const location = useLocation();
  const { brokerId } = location.state || {};
  const [brokerDetails, setBrokerDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [subDealerCount, setSubDealerCount] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [filteredSubDealers, setFilteredSubDealers] = useState([]);
  const [monthlySubDealers, setMonthlySubDealers] = useState([]);

  useEffect(() => {
    if (brokerId) {
      fetch(`http://localhost/broker/addBroker.php?id=${brokerId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setBrokerDetails(data.data);
            const dateCount = data.data.sub_dealers.reduce((acc, subDealer) => {
              const date = subDealer.created_at.split(" ")[0];
              acc[date] = acc[date] ? acc[date] + 1 : 1;
              return acc;
            }, {});
            setSubDealerCount(dateCount);

            const monthlyCount = data.data.sub_dealers.reduce((acc, subDealer) => {
              const month = subDealer.created_at.split(" ")[0].slice(0, 7);
              acc[month] = acc[month] ? acc[month] + 1 : 1;
              return acc;
            }, {});
            setMonthlyData(monthlyCount);
            filterSubDealersByMonth(new Date());
          }
        })
        .catch((error) => console.error("Error fetching broker details:", error));
    }
  }, [brokerId]);

  const filterSubDealersByDate = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    const filtered = brokerDetails?.sub_dealers.filter(
      (subDealer) => subDealer.created_at.split(" ")[0] === formattedDate
    );
    setFilteredSubDealers(filtered || []);

    // If no data is available for the selected date, show an empty doughnut chart
    if (filtered.length === 0) {
      setSubDealerCount({});
    } else {
      // Update the doughnut data for the selected date
      const dateCount = filtered.reduce((acc, subDealer) => {
        const date = subDealer.created_at.split(" ")[0];
        acc[date] = acc[date] ? acc[date] + 1 : 1;
        return acc;
      }, {});
      setSubDealerCount(dateCount);
    }
  };

  const filterSubDealersByMonth = (month) => {
    setSelectedMonth(month);
    const formattedMonth = month.toISOString().slice(0, 7); // 'yyyy-mm'
    const filtered = brokerDetails?.sub_dealers.filter((subDealer) => subDealer.created_at.slice(0, 7) === formattedMonth);
    setMonthlySubDealers(filtered || []);

    // Show empty chart if no data is available for the selected month
    if (filtered.length === 0) {
      setMonthlyData({});
    } else {
      const monthlyCount = filtered.reduce((acc, subDealer) => {
        const month = subDealer.created_at.slice(0, 7); // 'yyyy-mm'
        acc[month] = acc[month] ? acc[month] + 1 : 1;
        return acc;
      }, {});
      setMonthlyData(monthlyCount);
    }
  };

  const doughnutData = {
    labels: Object.keys(subDealerCount),
    datasets: [
      {
        label: "Sub-dealer Count",
        data: Object.values(subDealerCount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF8C00"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF8C00"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Sub-dealer Count",
        data: Object.values(monthlyData),
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  // Hover event handler for Doughnut chart
  const handleDoughnutHover = (event, chartElement) => {
    if (chartElement.length) {
      const index = chartElement[0].index;
      const selectedDate = Object.keys(subDealerCount)[index];
      filterSubDealersByDate(new Date(selectedDate));
    }
  };

  // Hover event handler for Bar chart
  const handleBarHover = (event, chartElement) => {
    if (chartElement.length) {
      const index = chartElement[0].index;
      const selectedMonth = Object.keys(monthlyData)[index];
      filterSubDealersByMonth(new Date(`${selectedMonth}-01`)); // Use first day of the month
    }
  };

  if (!brokerDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Broker Details</h1>

      <div className="details-container">
        <h2>Personal Details</h2>
        <div className="details-grid">
          <div className="details-item">
            <span className="label">ID:</span>
            <span className="value">{brokerDetails.id}</span>
          </div>
          <div className="details-item">
            <span className="label">Name:</span>
            <span className="value">{brokerDetails.name}</span>
          </div>
          <div className="details-item">
            <span className="label">Email:</span>
            <span className="value">{brokerDetails.email}</span>
          </div>
          <div className="details-item">
            <span className="label">Phone:</span>
            <span className="value">{brokerDetails.phone}</span>
          </div>
          <div className="details-item">
            <span className="label">Company:</span>
            <span className="value">{brokerDetails.company}</span>
          </div>
          <div className="details-item">
            <span className="label">Dealer Type:</span>
            <span className="value">{brokerDetails.dealerType}</span>
          </div>
          <div className="details-item">
            <span className="label">District:</span>
            <span className="value">{brokerDetails.district}</span>
          </div>
          <div className="details-item">
            <span className="label">Address:</span>
            <span className="value">{brokerDetails.address}</span>
          </div>
        </div>
      </div>

      <div className="sub-dealers-container">
        <h2>Sub-Dealers</h2>
        <div className="date-picker-container">
          <label>Select Day:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => filterSubDealersByDate(date)}
            dateFormat="yyyy/MM/dd"
            className="date-picker"
          />
        </div>

        <div className="month-picker-container">
          <label>Select Month:</label>
          <DatePicker
            selected={selectedMonth}
            onChange={(date) => filterSubDealersByMonth(date)}
            dateFormat="yyyy/MM"
            showMonthYearPicker
            className="month-picker"
          />
        </div>

        <h3>Sub-dealers for {selectedDate.toISOString().split("T")[0]}</h3>
        {filteredSubDealers.length === 0 ? (
          <p>No sub-dealers found for this date.</p>
        ) : (
          <div className="sub-dealers-grid">
            {filteredSubDealers.map((subDealer) => (
              <div key={subDealer.id} className="sub-dealer-card">
                <div className="card-header">
                  <h3 className="sub-dealer-name">{subDealer.name}</h3>
                  <p className="sub-dealer-type">{subDealer.dealerType}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h2>Sub-dealer Count by Day (Doughnut)</h2>
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.label || "";
                      const value = context.raw || 0;
                      return `${label}: ${value} Sub-dealers`;
                    },
                  },
                },
              },
              onHover: handleDoughnutHover,
            }}
          />
        </div>

        <div className="chart-box">
          <h2>Sub-dealer Count by Month (Bar)</h2>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.label || "";
                      const value = context.raw || 0;
                      return `${label}: ${value} Sub-dealers`;
                    },
                  },
                },
              },
              onHover: handleBarHover,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BrokerDetails;

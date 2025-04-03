import React from "react";
import { useLocation } from "react-router-dom";

const ListPage = () => {
  const location = useLocation();
  const { data } = location.state || { data: [] };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Details</h2>
      {data.length === 0 ? (
        <p>No records available.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
              {item.name} - {item.dealer_type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListPage;

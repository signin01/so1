import React from 'react';
import { FaCalendarTimes } from 'react-icons/fa';

const ExpiryAlert = ({ medicines }) => {
  if (!medicines || medicines.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-700">✅ No expiring medicines</p>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-red-800 font-semibold flex items-center gap-2">
        <FaCalendarTimes className="text-red-600" />
        Expiry Alert ({medicines.length} items)
      </h3>
      <ul className="mt-2 space-y-1">
        {medicines.map((med) => (
          <li key={med.id} className="text-sm text-red-700 flex justify-between">
            <span>{med.name}</span>
            <span className="font-bold">Expires: {new Date(med.expiry_date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpiryAlert;

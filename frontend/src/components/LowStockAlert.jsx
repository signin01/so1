import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const LowStockAlert = ({ medicines }) => {
  if (!medicines || medicines.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-700">✅ No low stock items</p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="text-yellow-800 font-semibold flex items-center gap-2">
        <FaExclamationTriangle className="text-yellow-600" />
        Low Stock Alert ({medicines.length} items)
      </h3>
      <ul className="mt-2 space-y-1">
        {medicines.map((med) => (
          <li key={med.id} className="text-sm text-yellow-700 flex justify-between">
            <span>{med.name}</span>
            <span className="font-bold">Stock: {med.stock_quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlert;

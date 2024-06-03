import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const Checklist = ({ options, onChange }) => {
  const [items, setItems] = useState(options);

  const handleCheck = (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    onChange(updatedItems);
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center p-2 rounded-md border ${
            item.disabled ? 'bg-gray-200' : 'bg-white'
          } ${!item.disabled ? 'cursor-pointer hover:bg-gray-50' : ''}`}
          onClick={!item.disabled ? () => handleCheck(item.id) : null}
        >
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            data-testid={item.label}
            checked={item.checked}
            disabled={item.disabled}
            onChange={() => {}} // event is handled by div, leave this with empty func to prevent console warning 
          />
          <span
            className={`ml-2 text-lg ${
              item.disabled ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            {item.label}
          </span>
          {item.checked && !item.disabled && (
            <FaCheck className="ml-auto text-green-500" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Checklist;

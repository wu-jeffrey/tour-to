import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ expandedContent, collapsedContent }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="absolute top-0 flex h-screen shadow-xl">
      {/* TODO: Remove coupling here with the w-16 == 4rem which is used to get the width of the map so that the sidebar doesn't obscure it */}
      <div className={`relative bg-white text-stone-950 transition-all duration-300 ${expanded ? 'w-96' : 'w-16'}`}>
        <button
          className={`absolute top-5 ${expanded ? 'right-5' : 'left-5'} transition-all duration-300`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <div className={`overflow-hidden ${expanded ? 'p-4' : 'p-2'}`}>
          {expanded ? expandedContent : collapsedContent}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

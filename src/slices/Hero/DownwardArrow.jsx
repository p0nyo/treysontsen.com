import React from 'react';
import { SlArrowDown } from "react-icons/sl";

const DownwardArrow = () => {
  return (
    <div className="animate-pulse arrow-container fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
      <SlArrowDown className="arrow-icon text-5xl font-extrabold text-stone-800" />
    </div>
  );
};

export default DownwardArrow;
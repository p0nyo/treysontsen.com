import React from 'react';
import { SlArrowDown } from "react-icons/sl";

const DownwardArrow = () => {
  return (
    <div className="animate-pulse arrow-container fixed lg:bottom-10 md:bottom-0 sm:bottom-0 transform -translate-x-1/2 z-50">
      <SlArrowDown className="arrow-icon text-5xl font-extrabold text-stone-800" />
    </div>
  );
};

export default DownwardArrow;
import React from 'react';

const LoadingDots = ({ color = "text-blue-500" }) => {
  return (
    <div className="flex justify-center items-center">
      <div className={`relative w-20 h-3.5 ${color} loader-dots`}>
        <div className="absolute w-3.5 h-3.5 bg-current rounded-full animate-loader-dots1 left-2"></div>
        <div className="absolute w-3.5 h-3.5 bg-current rounded-full animate-loader-dots2 left-2"></div>
        <div className="absolute w-3.5 h-3.5 bg-current rounded-full animate-loader-dots2 left-8"></div>
        <div className="absolute w-3.5 h-3.5 bg-current rounded-full animate-loader-dots3 left-14"></div>
      </div>
    </div>
  );
};

export default LoadingDots;

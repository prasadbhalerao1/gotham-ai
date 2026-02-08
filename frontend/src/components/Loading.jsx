import React from 'react';

const Loading = () => {
  return (
    <div className="flex-center fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-black transition-opacity duration-500 ease-in-out">
      <div className="three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </div>
  );
};

export default Loading;

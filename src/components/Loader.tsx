import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 z-50 h-screen w-screen items-center bg-black/50">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full absolute border-2 border-solid border-gray-200"></div>

        <div
            className="w-12 h-12 rounded-full animate-spin absolute border-2 border-solid border-violet-500 border-t-transparent shadow-md">
        </div>
    </div>
    </div>
  );
};

export default Loader;

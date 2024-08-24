import React from "react";

const Loader = () => {
  return (
    <div className="absolute z-50 flex h-screen w-screen items-center justify-center bg-black/50">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-2 border-solid border-gray-200"></div>

        <div
            className="w-12 h-12 rounded-full animate-spin absolute border-2 border-solid border-violet-500 border-t-transparent shadow-md">
        </div>
    </div>
    </div>
  );
};

export default Loader;

import React from "react";
import { Outlet } from "react-router-dom";

const Wrapper = () => {
  return (
    <>
      <div className="h-screen flex flex-col md:flex-row">
        <div className="flex flex-col items-center justify-center text-white py-20 md:py-0 w-full md:w-2/4 login-section p-4">
          <div className="center">
            <h1 className="font-bold">
              <span>Live</span>
              <span>Live</span>
              <span>Live</span>
            </h1>
          </div>
        </div>
        <div className="w-full md:w-2/4 flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Wrapper;

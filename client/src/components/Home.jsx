import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="w-full relative">
        <img
          src="https://images.pexels.com/photos/9072250/pexels-photo-9072250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="img"
          className="w-full h-screen object-cover"
        />
        <Link to="login">
          <button className="btn uppercase font-bold text-sm absolute py-2 top-10 left-10 px-5 btn bg-[#F8F9FA] text-black hover:bg-black hover:text-[#F8F9FA]">
            Live Demo
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;

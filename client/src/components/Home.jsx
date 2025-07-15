import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="w-full relative p-5 bg-white dark:bg-black transition-colors duration-700 ease-in-out">
        <div>
          <h1 className="text-3xl sm:text-5xl text-black md:text-6xl lg:text-7xl xl:text-8xl font-bold dark:text-white">
            Chat. <br />A<span className="text-pink">non</span>ymously.
            <br /> LIV<span className="text-pink">E.</span>
          </h1>
          <p className="mt-4 text-md mb-5 text-pink">
            Start a real conversation without revealing who you are. No names,
            just voices.
          </p>
        </div>
        <div className="flex">
          <Link to="login">
            <button className="bttn uppercase font-bold text-sm py-3 mr-5 px-6 bg-[#1F1D1B] hover:text-[#1F1D1B] text-white hover:bg-white hover:border-black border dark:hover:bg-transparent dark:hover:text-white dark:hover:border-pink dark:border-white shadow-transparent">
              Join LIVE
            </button>
          </Link>
          <Link to="login">
            <button className="bttn uppercase border outline-none font-bold text-sm py-3 px-6 bg-[#ff1361] hover:bg-transparent hover:text-pink hover:border-[#ff1361] text-white dark:text-pink dark:bg-transparent dark:hover:border-pink dark:border-pink dark:hover:text-white">
              Try Demo
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;

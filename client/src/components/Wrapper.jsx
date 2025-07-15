import { Link, Outlet } from "react-router-dom";
import {useTheme} from "../context/ThemeContext"

const Wrapper = () => {
   const { theme, changeTheme, themeLoaded } = useTheme();
  
  return (
    <>
      <div className="h-screen flex flex-col md:flex-row">
        <div className="flex flex-col items-center justify-center text-white py-20 md:py-0 w-full md:w-[45%] wrapper p-4">
          <div className="center">
            <Link to="/">
            <h1 className="font-bold">
              <span>Live</span>
              <span>Live</span>
              <span>Live</span>
              </h1>
              </Link>
          </div>
        </div>
        <div className="w-full md:w-[55%] h-full flex flex-col items-center justify-start md:justify-center relative bg-white dark:bg-black transition-colors duration-700 ease-in-out">
          {themeLoaded && (
            <label className="switch absolute -top-[9rem] md:top-5 right-3">
              <input
                type="checkbox"
                onChange={changeTheme}
                checked={theme === "dark"}
              />
              <span className="slider"></span>
            </label>
          )}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Wrapper;

import Wrapper from "./Wrapper";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <Wrapper>
        <h1 className="text-7xl my-10 font-bold text-center text-black dark:text-white">
          Pa<span className="text-pink">G</span>e <br /> N
          <span className="text-pink">o</span>T F
          <span className="text-pink">o</span>Un
          <span className="text-pink">D</span>
              </h1>
              <Link to="/">
                <button className="bttn uppercase font-bold text-sm py-3 mr-5 px-6 bg-[#1F1D1B] hover:text-[#1F1D1B] text-white hover:bg-white hover:border-black border dark:hover:bg-transparent dark:hover:text-white dark:hover:border-pink dark:border-white shadow-transparent">
                  Go H<span>o</span>ME
                </button>
              </Link>
      </Wrapper>
    </>
  );
}

export default PageNotFound
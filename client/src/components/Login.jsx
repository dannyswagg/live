import { Link } from "react-router-dom";
import { Formik } from "formik";
import { auth } from "./Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGear } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="dark"
      />
      <div className="py-5 px-5 w-full">
        <h1 className="text-4xl md:text-5xl text-black dark:text-pink"> Login Account</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
              );
              toast.success("Login Successful!");
              setTimeout(() => {
                navigate("/live");
              }, 500);
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="my-3">
                <input
                  className="border bg-transparent border-black rounded-md outline-none w-full focus:border-pink md:w-[70%] text-sm dark:border-pink dark:bg-transparent dark:text-white dark:placeholder:text-white"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="Enter email"
                />
                <p className="text-xs text-pink">
                  {errors.email && touched.email && errors.email}
                </p>
              </div>
              <div className="my-3">
                <input
                  className="bg-transparent border border-black rounded-md outline-none focus:border-pink w-full md:w-[70%] text-sm dark:border-pink dark:bg-transparent dark:text-white dark:placeholder:text-white"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Enter password"
                  autoComplete="off"
                />
                <p className="text-xs text-pink">
                  {errors.password && touched.password && errors.password}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="bg-black text-white px-2 py-2 bttn text-sm border w-28 hover:bg-pink hover:text-white hover:border-pink disabled:cursor-not-allowed disabled:!bg-black disabled:text-white disabled:border-black dark:border-pink rounded-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-1">
                    Login <FaGear className="gear-icon animate-spin text-xs" />
                  </span>
                ) : (
                  <span className="default flex items-center justify-center">
                    Login
                  </span>
                )}
              </button>
            </form>
          )}
        </Formik>
        <div className="mt-5">
          <p className="text-xs text-pink py-1">
            Don't have an account? <br />
            <Link to="/signup" className="font-bold text-black dark:text-white">
              Create.
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

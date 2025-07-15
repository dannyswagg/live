import { Link } from "react-router-dom";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWrench } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Register = () => {
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
        <h1 className="text-4xl md:text-5xl dark:text-pink text-black">Create Account</h1>
        <Formik
          initialValues={{ name: "", email: "", phone: "", password: "" }}
          validate={(values) => {
            const errors = {};

            if (!values.name) {
              errors.name = "Required";
            }

            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }

            if (!values.phone) {
              errors.phone = "Required";
            } else if (!/^\d{10,15}$/.test(values.phone)) {
              errors.phone = "Invalid phone number";
            }

            if (!values.password) {
              errors.password = "Required";
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Create user with email and password
              const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
              );

              // Get the authenticated user from userCredential
              const user = userCredential.user;

              if (user) {
                // Add user data to Firestore
                await setDoc(doc(db, "Users", user.uid), {
                  email: values.email,
                  name: values.name,
                  phone: values.phone,
                });

                toast.success("User created successfully!");
                setTimeout(() => {
                  navigate("/live");
                }, 500);
              } else {
                toast.error("User registration failed. Please try again.");
              }
            } catch (error) {
              // Handle errors from Firebase
              let errorMessage = "An unknown error occurred.";
              if (error.code === "auth/email-already-in-use") {
                errorMessage = "This email is already in use.";
              } else if (error.code === "auth/weak-password") {
                errorMessage = "The password is too weak.";
              } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
              }
              toast.error(errorMessage);
            }
            setSubmitting(false);
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
          }) => (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="my-3">
                <input
                  className="bg-transparent border border-black focus:border-pink rounded-md outline-none w-full md:w-[70%] dark:border-pink dark:bg-transparent dark:text-white dark:placeholder:text-white"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-pink">
                  {errors.name && touched.name && errors.name}
                </p>
              </div>
              <div className="my-3">
                <input
                  className="bg-transparent border border-black focus:border-pink rounded-md outline-none w-full md:w-[70%] dark:border-pink dark:bg-transparent dark:text-white dark:placeholder:text-white"
                  type="email"
                  name="email"
                  placeholder="Your email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-pink">
                  {errors.email && touched.email && errors.email}
                </p>
              </div>
              <div className="my-3">
                <input
                  className="bg-transparent border border-black focus:border-pink rounded-md outline-none w-full md:w-[70%] dark:border-pink dark:bg-transparent dark:text-white dark:placeholder:text-white"
                  type="text"
                  name="phone"
                  placeholder="Phone No."
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-pink">
                  {errors.phone && touched.phone && errors.phone}
                </p>
              </div>
              <div className="my-3">
                <input
                  className="bg-transparent border border-black focus:border-pink rounded-md outline-none w-full md:w-[70%] dark:border-pink dark:bg-transparent dark:text-white dark:placeholder:text-white"
                  type="password"
                  name="password"
                  placeholder="Create password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-pink">
                  {errors.password && touched.password && errors.password}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-2 py-2 btn border w-28 hover:bg-pink hover:text-white hover:border-pink disabled:cursor-not-allowed disabled:!bg-black disabled:text-white disabled:border-black"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-1">
                    Create
                    <FaWrench className="text-xs animate-bounce" />
                  </span>
                ) : (
                  <span className="default">Create</span>
                )}
              </button>
            </form>
          )}
        </Formik>
        <div className="mt-5">
          <p className="text-xs dark:text-white text-black">
            Already have an account?
            <br />
            <Link to="/login" className="font-bold text-green-500">
              Login Here.
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

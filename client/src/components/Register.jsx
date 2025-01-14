import React from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
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
        <h1 className="text-5xl">Create Account</h1>
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
                  className="bg-transparent border border-black rounded-md outline-none w-full"
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-red-600">
                  {errors.name && touched.name && errors.name}
                </p>
              </div>
              <div className="my-3">
                <input
                  className="bg-transparent border border-black rounded-md outline-none w-full"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-red-600">
                  {errors.email && touched.email && errors.email}
                </p>
              </div>
              <div className="my-3">
                <input
                  className="bg-transparent border border-black rounded-md outline-none w-full"
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-red-600">
                  {errors.phone && touched.phone && errors.phone}
                </p>
              </div>
              <div className="my-3">
                <input
                  className="bg-transparent border border-black rounded-md outline-none w-full"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-red-600">
                  {errors.password && touched.password && errors.password}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-2 py-2 btn border w-32 hover:bg-white hover:text-black hover:border-black"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </form>
          )}
        </Formik>
        <div className="mt-5">
          <p className="text-xs">
            Already have an account?
            <br />
            <Link to="/login" className="font-bold text-green-500">
              Login now!
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

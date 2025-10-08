import React from "react";
import Live from "./components/Live";
import Wrapper from "./components/Wrapper";
import Login from "./components/Login";
import Register from "./components/Register";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./components/PageNotFound";

const pageTransition = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.5 },
};

function App() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<Wrapper />}>
            <Route index element={<Home />} />
            <Route
              path="login"
              element={
                <motion.div
                  {...pageTransition}
                  className="flex justify-center w-full"
                >
                  <Login />
                </motion.div>
              }
            />
            <Route
              path="signup"
              element={
                <motion.div
                  {...pageTransition}
                  className="flex justify-center w-full"
                >
                  <Register />
                </motion.div>
              }
            />
          </Route>
          <Route path="/live" element={<Live />} />
          {/* Protect Chat Route */}
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <Live />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;

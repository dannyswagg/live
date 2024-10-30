import React from "react";
import Live from "./components/Live";
import Wrapper from "./components/Wrapper";
import Login from "./components/Login";
import Register from "./components/Register";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Register />} />
        </Route>
        <Route path="/live" element={<Live />} />
      </Routes>
    </>
  );
}

export default App;

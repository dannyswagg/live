import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io.connect("http://localhost:5174");

function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User found:", user);
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log("User details:", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  // Run fetchUserData when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  // Function to send a message via socket
  const sendMessage = () => {
    if (message.trim() !== "") {
      // Ensure the message is not just whitespace
      socket.emit("send_message", { message });
      setMessage(""); // Clear the input after sending
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
      toast.success(`New message: ${data.message}`);
    });
  }, []);

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
      <div className="wrapper text-white text-center">
        <div className="flex flex-col justify-between h-screen py-[20px]">
          <div className="messages flex justify-center items-center w-full relative">
            <div className="flex flex-col text-center">
              <h1 className="text-3xl md:text-5xl font-bold">Messages</h1>
            </div>
            <p className="absolute right-2 -px-5 cursor-pointer text-md text-white font-bold">
              {userDetails
                ? userDetails.email.slice(0, 2).toUpperCase()
                : "user"}
            </p>
            <FaPowerOff
              onClick={handleLogout}
              className="absolute right-10 cursor-pointer"
            />
          </div>

          <div className="input-container">
            <p className="py-1 px-10 bg-transparent w-fit my-3 mx-auto rounded-md">
              {messageReceived}
            </p>
            <input
              className="w-[80%] sm:w-2/4 outline-0 border border-white text-white bg-transparent"
              type="text"
              placeholder="Send message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              className="py-[10px] px-2 bg-transparent text-white border border-white outline-0"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

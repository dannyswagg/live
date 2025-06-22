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
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  // Function to fetch user data
  const fetchUserData = async (user) => {
    if (user) {
      try {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          toast.error("User details not found");
        }
      } catch (error) {
        toast.error("Error fetching user data: " + error.message);
      }
    }
  };

  // Set up auth listener and fetch user data once authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        toast.error("User is not logged in");
        navigate("/login"); // Redirect to login if user is not authenticated
      }
    });

    // Cleanup the auth listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Redirect to homepage after logout
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  // Function to send a message via socket
  const sendMessage = () => {
    if (message.trim() !== "" && userDetails) {
      const timestamp = new Date().toISOString();
      // alert(timestamp);
      const data = {
        message,
        senderId: userDetails.email, timestamp// or userDetails.uid
      };

      socket.emit("send_message", data);

      setMessages((prevMessages) => [
        ...prevMessages,
        { message, isSender: true, timestamp },
      ]);

      setMessage(""); // Clear input
    }
  };

  // Listen for message history and incoming messages
useEffect(() => {
  const receiveMessage = (data) => {
    // Only add if not the current user's message
    if (data.senderId !== userDetails?.email) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, isSender: false, timestamp: data.timestamp },
      ]);
      // toast.success(`New message: ${data.message}`);
    }
  };

  socket.on("receive_message", receiveMessage);

  return () => {
    socket.off("receive_message", receiveMessage);
  };
}, [userDetails]); 

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="dark"
      />
      <div className="wrapper text-white text-center">
        <div className="flex flex-col justify-between h-screen py-[20px]">
          <div className="messages flex justify-between items-center w-full relative">
            <div className="flex flex-col text-center w-full justify-center items-center">
              <h1 className="text-3xl md:text-5xl font-bold">Messages</h1>
            </div>
            <div className="flex items-center pr-2">
              <FaPowerOff
                onClick={handleLogout}
                className="cursor-pointer mr-2"
              />
              <p className="uppercase cursor-pointer text-md text-white font-bold bg-black rounded-full p-2">
                {userDetails
                  ? userDetails.email.slice(0, 2).toUpperCase()
                  : "OO"}
              </p>
            </div>
          </div>

          <div className="messages-container overflow-y-auto h-[80%] w-[90%] sm:w-[55%] md:[w-50%] mx-auto">
            {/* Render all messages */}
            {messages.map((msg, index) => (
              <p
                key={index}
                className={`${
                  msg.isSender ? "sent-message" : "received-message"
                }`}
              >
                {msg.message}
                <span className="text-[0.50rem] ml-2 text-white mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            ))}
          </div>

          <div className="input-container">
            <input
              className="w-[80%] sm:w-2/4 outline-0 border border-white text-white bg-transparent"
              type="text"
              placeholder="Send message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              className="py-[10px] px-2 bg-transparent hover:bg-black text-white border border-white outline-0"
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

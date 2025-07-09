import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

// const socket = io.connect("http://localhost:5174");
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const { theme, changeTheme, themeLoaded } = useTheme();

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
      <div className="wrapper bg-hero-gradient text-white text-center">
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
              {/* {themeLoaded && (
                <label className="switch absolute top-2 right-32">
                  <input
                    type="checkbox"
                    onChange={changeTheme}
                    checked={theme === "dark"}
                  />
                  <span className="slider w-[55px] h-[30px]"></span>
                </label>
              )} */}
              <div className="dropdown dropdown-end dropdown-hover">
                <p
                  tabIndex={0}
                  role="button"
                  className="uppercase cursor-pointer ml-2 text-md text-white font-bold bg-black rounded-full p-2"
                >
                  CR
                </p>

                <div
                  tabIndex={0}
                  className="dropdown-content menu bg-transparent text-white z-[1] w-52 p-2"
                >
                  <input
                    className="bg-transparent border outline-none border-white text-white"
                    type="text"
                    placeholder="Enter room"
                  />
                </div>
              </div>
              <div className="ml-2" onClick={changeTheme}>
                <h6 className="uppercase cursor-pointer text-md text-white font-bold bg-black w-10 rounded-full p-2">
                  {theme === "light" ? "D" : "L"}
                </h6>
              </div>
            </div>
          </div>

          <div className="messages-container hide-scrollbar my-1 overflow-y-auto h-full md:h-[80%] px-4 md:px-0 w-full sm:w-[55%] md:[w-50%] mx-auto">
            {/* Render all messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.isSender ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-bubble bg-black text-white">
                  {msg.message}
                </div>
                <div className="chat-footer opacity-50 text-xs text-white mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
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

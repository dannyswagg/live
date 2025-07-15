import { useEffect, useState, useRef } from "react";
import socket from "./Socket";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";
import { FaMoon } from "react-icons/fa6";
import { FaSun } from "react-icons/fa";
import { IoSend } from "react-icons/io5";



function App() {
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
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
  
  useEffect(() => {
  const el = textareaRef.current;
  if (el) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
}, [message]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
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
        senderId: userDetails.email, timestamp
      };

      socket.emit("send_message", data);

      setMessages((prevMessages) => [
        ...prevMessages,
        { message, isSender: true, timestamp },
      ]);

      setMessage(""); // Clear input
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen for message history and incoming messages
useEffect(() => {
  const receiveMessage = (data) => {
    if (data.senderId !== userDetails?.email) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, isSender: false, timestamp: data.timestamp },
      ]);
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
      <div className="wrapper bg-hero-gradient text-white text-center h-screen">
        <div className="flex flex-col h-full py-3">
          <nav className="messages flex items-center w-full px-4">
            {/* Centered Heading */}
            <div className="absolute md:left-1/2 left-3 md:transform transform-none md:-translate-x-1/2 -translate-x-0">
              <h1 className="text-3xl md:text-5xl font-bold">Messages</h1>
            </div>

            {/* Icons on the right */}
            <div className="flex items-center ml-auto space-x-2">
              <FaPowerOff
                onClick={handleLogout}
                className="cursor-pointer mr-2"
              />
              <p className="uppercase cursor-pointer text-md text-white font-bold bg-black rounded-full p-2">
                {userDetails
                  ? userDetails.email.slice(0, 2).toUpperCase()
                  : "OO"}
              </p>
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
                    className="bg-transparent border outline-none border-white placeholder:text-white"
                    type="text"
                    placeholder="Enter room"
                  />
                </div>
              </div>
              <div className="ml-2" onClick={changeTheme}>
                <div className="uppercase cursor-pointer text-md transition-colors duration-700 ease-in-out text-white font-bold bg-black w-10 h-10 flex items-center justify-center rounded-full p-2">
                  {theme === "light" ? <FaMoon /> : <FaSun />}
                </div>
              </div>
            </div>
          </nav>

          <div
            className="messages-container hide-scrollbar flex-1 overflow-y-auto px-4 md:px-0 w-full sm:w-[55%] md:[w-50%] mx-auto"
          >
            {/* Render all messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.isSender ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-bubble bg-black text-white text-left text-sm">
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
            <div ref={messagesEndRef}></div>
          </div>

          <div className="input-container sticky bottom-0 w-full flex items-center justify-center">
            <textarea
              ref={textareaRef}
              rows={1}
              className="max-h-[150px] w-[80%] sm:w-2/4 mr-1 outline-0 border py-[10px] px-2 border-white placeholder:text-white bg-transparent hide-scrollbar"
              type="text"
              placeholder="Send message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              className="py-[12px] px-2 bg-transparent hover:bg-black text-white border border-white outline-0"
              onClick={sendMessage}
            >
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

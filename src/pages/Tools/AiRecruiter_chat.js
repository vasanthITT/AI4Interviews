import React, { useState } from "react";
import {
  SiApple,
  SiNvidia,
  SiOracle,
  SiAmazon,
  SiGoogle,
  SiTesla,
} from "react-icons/si";
import { FaIbm, FaMicrosoft } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function AiRecruiterChat() {
  const [selectedCompany, setSelectedCompany] = useState("Apple");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello, I am a recruiter at ${selectedCompany}. I'm here to answer any questions about recruitment, interviews, and company culture.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const companies = [
    { name: "Apple", icon: <SiApple /> },
    { name: "Microsoft", icon: <FaMicrosoft /> },
    { name: "Google", icon: <SiGoogle /> },
    { name: "NVIDIA", icon: <SiNvidia /> },
    { name: "Oracle", icon: <SiOracle /> },
    { name: "Amazon", icon: <SiAmazon /> },
    { name: "Tesla", icon: <SiTesla /> },
  ];

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
    setMessages([
      {
        role: "assistant",
        content: `Hello, I am a recruiter at ${company}. I'm here to answer any questions about recruitment, interviews, and company culture.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input, timestamp: new Date().toLocaleTimeString() },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("https://interviewbot.intraintech.com/recruiter/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: selectedCompany,
          user_input: input,
        }),
      });

      const data = await res.json();
      setTyping(true);
      typeMessage(data.response);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Error connecting to AI.", timestamp: new Date().toLocaleTimeString() },
      ]);
    }
  };

  const typeMessage = (message) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.role === "assistant") {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, content: message.substring(0, i + 1) },
            ];
          } else {
            return [
              ...prevMessages,
              { role: "assistant", content: message.substring(0, i + 1), timestamp: new Date().toLocaleTimeString() },
            ];
          }
        });
        i++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 30);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const sidebarVariants = {
    hidden: { x: -250, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, duration: 0.5 } },
  };

  const chatContainerVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, duration: 0.5, delay: 0.2 } },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col md:flex-row min-h-[85vh] bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-4 pt-6" // Added pt-16 for navbar
    >
      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        className="w-full md:w-64 lg:w-72 bg-white/90 backdrop-blur-sm shadow-lg p-4 rounded-lg md:rounded-r-none mb-4 md:mb-0 md:mr-4 h-auto md:h-[87vh] overflow-y-auto"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-4 text-gray-800"
        >
          Recruiters
        </motion.h2>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
          }}
        >
          {companies.map(({ name, icon }) => (
            <motion.button
              key={name}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              whileHover="hover"
              whileTap="tap"
              initial="initial"
              className={`flex items-center w-full text-left p-2 rounded-lg mb-2 transition-all duration-300 ${
                selectedCompany === name
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                  : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
              }`}
              onClick={() => handleCompanyChange(name)}
            >
              <motion.span className="mr-3 text-xl" variants={buttonVariants}>
                {icon}
              </motion.span>
              {name}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Chat Section */}
      <motion.div
        variants={chatContainerVariants}
        className="flex-1 flex flex-col p-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg h-auto md:h-[87vh] overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex-1 bg-white rounded-lg p-4 overflow-y-auto max-h-[calc(87vh-80px)]" // Adjusted for input height
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
                className={`flex items-start my-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white mr-2"
                  >
                    <FaRobot className="text-white" />
                  </motion.div>
                )}
                <motion.div
                  className={`p-3 rounded-lg max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                      : "bg-gray-100 border border-gray-200 text-gray-800"
                  } transition-all duration-300`}
                  whileHover={{ scale: 1.01 }}
                >
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-4 flex items-center gap-2"
        >
          <motion.input
            type="text"
            className="flex-1 mt-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-md"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            whileFocus={{ scale: 1.01, boxShadow: "0 0 8px rgba(99, 102, 241, 0.5)" }}
          />
          <motion.button
            className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md"
            onClick={sendMessage}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial="initial"
          >
            Send
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
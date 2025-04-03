import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotMessage from "../../components/BotMessage";

const flaskBaseUrl = process.env.REACT_APP_PRACTICE_URL;

const StartGeneralInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { skills = "", knowledgeDomain = "", interviewType = "General", experience = "" } = location.state || {};
  const [isListening, setIsListening] = useState(false);
  const [stage, setStage] = useState("chooseAvatar");
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const avatars = [
    { id: 1, name: "Anandi", img: "https://i.postimg.cc/T16ypJY2/Anandi.jpg", description: "Beginner level" },
    { id: 2, name: "Ada", img: "https://i.postimg.cc/7hfgx65q/Ada.jpg", description: "Moderate level" },
    { id: 3, name: "Chandragupt", img: "https://i.postimg.cc/s2G1mNMD/Chandragupt.jpg", description: "Intermediate level" },
    { id: 4, name: "Alexander", img: "https://i.postimg.cc/QxNtwtFz/Hyp.jpg", description: "Advanced level" },
    { id: 5, name: "Tesla", img: "https://i.postimg.cc/qqy8F7gq/Alex.jpg", description: "Expert level" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleStartSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setUserInput((prev) => prev + (prev ? " " : "") + speechToText);
    };
    recognition.onerror = (event) => {
      alert("Speech recognition error. Please try again.");
      setIsListening(false);
    };
    recognition.start();
  };

  const handleStartChat = () => {
    if (selectedAvatarIndex !== null && selectedQuestionCount !== null) {
      setCurrentQuestion(1);
      setStage("chat");
    }
  };

  useEffect(() => {
    if (stage === "chat") {
      const formData = new FormData();
      formData.append("skills", skills);
      formData.append("experience", experience);
      formData.append("interview_type", interviewType);
      formData.append("domain", knowledgeDomain);
      const chosenAvatar = avatars[selectedAvatarIndex];
      formData.append("level", chosenAvatar ? chosenAvatar.description : "");

      fetch(`${flaskBaseUrl}/start_interview`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            setMessages((prev) => [...prev, { sender: "bot", text: result.error, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          } else {
            setSessionId(result.session_id);
            setMessages([{ sender: "bot", text: result.question, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          }
        })
        .catch((error) => {
          setMessages((prev) => [...prev, { sender: "bot", text: "Failed to start the interview. Please try again later.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        });
    }
  }, [stage, skills, experience, interviewType, knowledgeDomain, selectedAvatarIndex]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isReportLoading) return;
    const userMessage = { sender: "user", text: userInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((prev) => [...prev, userMessage]);

    if (currentQuestion === selectedQuestionCount) {
      try {
        const response = await fetch(`${flaskBaseUrl}/next_question`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, user_answer: userInput, final: true }),
        });
        const data = await response.json();
        if (data.error) {
          setMessages((prev) => [...prev, { sender: "bot", text: data.error, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        } else {
          setMessages((prev) => [...prev, { sender: "bot", text: "Thank you for your answers. Generating your report...", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
          setUserInput("");
          setIsReportLoading(true);
          setTimeout(async () => {
            try {
              const reportResponse = await fetch(`${flaskBaseUrl}/finish_interview`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId }),
              });
              const report = await reportResponse.json();
              setReportData(report);
              setPopupType("report");
            } catch (error) {
              console.error("Error generating report:", error);
            }
            setIsReportLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Error sending final answer:", error);
      }
      return;
    }

    try {
      const response = await fetch(`${flaskBaseUrl}/next_question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, user_answer: userInput, final: false }),
      });
      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.error, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: data.question, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        setCurrentQuestion((prev) => prev + 1);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, something went wrong.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (isCodeMode && e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const indentation = "    ";
      const newValue = userInput.substring(0, selectionStart) + indentation + userInput.substring(selectionEnd);
      setUserInput(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + indentation.length;
      });
    }
  };

  const handleToggleCodeMode = () => setIsCodeMode((prev) => !prev);
  const handleEndTest = () => navigate("/ai-interview-test");

  const renderAvatarAndQuestionSelection = () => {
    return (
      <div className="w-full flex flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">Please choose your avatar</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-5 md:gap-8 mb-8 w-full max-w-4xl">
          {avatars.map((avatar, index) => (
            <div
              key={avatar.id}
              className={`cursor-pointer flex flex-col items-center bg-white p-3 sm:p-4 rounded-xl shadow-lg border transition-transform hover:scale-105 ${selectedAvatarIndex === index ? "ring-4 ring-indigo-500" : ""}`}
              onClick={() => setSelectedAvatarIndex(index)}
            >
              <div className="rounded-full/webkit-transition duration-300 w-16 h-16 sm:w-20 md:w-24 mb-3 overflow-hidden">
                <img src={avatar.img} alt={avatar.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">{avatar.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center mt-1">{avatar.description}</p>
            </div>
          ))}
        </div>
        {selectedAvatarIndex !== null && (
          <div className="flex flex-col items-center w-full max-w-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">Please select the number of questions</h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
              {[5, 10, 15].map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedQuestionCount(count)}
                  className={`flex-1 px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-base ${selectedQuestionCount === count ? "bg-indigo-600" : "bg-gray-400 hover:bg-gray-500"}`}
                >
                  {count}
                </button>
              ))}
            </div>
            <button
              onClick={handleStartChat}
              disabled={selectedQuestionCount === null}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-semibold text-sm sm:text-base ${selectedQuestionCount === null ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              Start Interview
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderChatInterface = () => {
    const chosenAvatar = selectedAvatarIndex !== null ? avatars[selectedAvatarIndex] : null;
    return (
      <div className="w-full flex flex-col min-h-[calc(100vh-4rem)] sm:min-h-[700px]">
        <div className="flex flex-col sm:flex-row flex-1">
          <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="rounded-full w-20 h-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 mb-4 overflow-hidden bg-gray-200 shadow-lg">
              {chosenAvatar && <img src={chosenAvatar.img} alt={chosenAvatar.name} className="w-full h-full object-cover" />}
            </div>
            {chosenAvatar && (
              <>
                <p className="text-lg sm:text-xl font-semibold mb-1 text-gray-800 text-center">{chosenAvatar.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 text-center">{chosenAvatar.description}</p>
              </>
            )}
            <div className="w-32 sm:w-40 md:w-48 h-6 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
              <p className="text-xs text-gray-400">Voice Wave</p>
            </div>
          </div>
          <div className="w-full sm:w-2/3 md:w-3/4 lg:w-4/5 flex flex-col p-4 sm:p-6 relative">
            <button onClick={() => setPopupType("confirm")} className="absolute top-2 sm:top-4 right-2 sm:right-4 px-3 sm:px-4 py-1 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md text-sm sm:text-base">
              End Test
            </button>
            <div className="flex flex-col mb-3">
              <div className="flex items-center">
                {chosenAvatar && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 mr-2">
                    <img src={chosenAvatar.img} alt="Bot Avatar" className="rounded-full object-cover w-full h-full" />
                  </div>
                )}
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                  {chosenAvatar ? `${chosenAvatar.name} Bot` : "Interview Bot"}
                </h2>
              </div>
              <div className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                Question {currentQuestion} of {selectedQuestionCount}
              </div>
            </div>
            <div className="flex-1 max-h-[50vh] sm:max-h-[500px] overflow-y-auto border p-3 rounded-lg mb-4 bg-white shadow-md">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-3 flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-[90%] sm:max-w-md text-sm sm:text-base ${msg.sender === "user" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"} whitespace-pre-wrap`}>
                    {msg.sender === "bot" ? <BotMessage text={msg.text} delay={15} /> : msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <button
                className={`p-2 rounded-full focus:outline-none transition-transform transform ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={handleStartSpeechRecognition}
                title={isListening ? "Listening..." : "Click to Speak"}
              >
                {isListening ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 sm:w-6 h-5 sm:h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 sm:w-6 h-5 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v10m0 0c1.657 0 3-1.343 3-3V3a3 3 0 10-6 0v5c0 1.657 1.343 3 3 3zm0 0c3.314 0 6-2.686 6-6m-6 6v4m0 0H9m3 0h3" />
                  </svg>
                )}
              </button>
              <textarea
                rows={isCodeMode ? 6 : 1}
                className={`flex-1 border rounded-lg px-3 py-2 focus:outline-none shadow-sm resize-none overflow-y-auto ${isCodeMode ? "max-h-48 sm:max-h-64" : "max-h-20 sm:max-h-24"} w-full`}
                placeholder="Type your message. (Enter=Send, Shift+Enter=New line)"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isReportLoading}
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleToggleCodeMode} className={`p-2 rounded-full text-gray-700 focus:outline-none ${isCodeMode ? "bg-indigo-200 hover:bg-indigo-300" : "bg-gray-200 hover:bg-gray-300"}`} title="Toggle code mode" disabled={isReportLoading}>
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                  </svg>
                </button>
                <button onClick={handleSendMessage} className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md text-sm sm:text-base" disabled={isReportLoading}>
                  {isReportLoading ? "Loading..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-white to-blue-50 flex flex-col items-center justify-center overflow-hidden px-2 sm:px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 sm:-top-32 -left-24 sm:-left-32 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-24 sm:-bottom-32 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 sm:-bottom-32 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>
      <div className="relative z-10 w-full max-w-[100%] sm:max-w-5xl py-4 sm:py-8 bg-white/30 backdrop-blur-xl backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/20 overflow-y-auto">
        {stage === "chooseAvatar" ? renderAvatarAndQuestionSelection() : renderChatInterface()}
        {popupType && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-2 sm:px-0">
            {popupType === "confirm" ? (
              <div className="bg-white p-4 sm:p-6 rounded shadow-lg text-center w-full max-w-md">
                <h2 className="text-lg sm:text-xl font-bold mb-4">End Test Confirmation</h2>
                <p className="mb-4 text-sm sm:text-base">
                  You still have {selectedQuestionCount - currentQuestion + 1} questions remaining. If you proceed now you will not get report. Do you want to proceed?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button onClick={handleEndTest} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm sm:text-base">
                    Yes
                  </button>
                  <button onClick={() => setPopupType(null)} className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm sm:text-base">
                    Cancel
                  </button>
                </div>
              </div>
            ) : popupType === "report" && reportData ? (
              <div className="bg-white p-4 sm:p-8 rounded shadow-lg w-full max-w-3xl mx-2 sm:mx-4 overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Interview Report</h2>
                <div className="space-y-4">
                  {reportData.marks_detail.map((item, index) => (
                    <div key={index} className="p-3 sm:p-4 border rounded text-sm sm:text-base">
                      <p className="font-semibold">Question {index + 1}:</p>
                      <p className="mb-2">{item.question}</p>
                      <p className="font-semibold">Your Answer:</p>
                      <p className="mb-2">{item.answer}</p>
                      <p className="font-semibold">Correct Answer:</p>
                      <p className="mb-2">{item.correct_answer}</p>
                      <p>
                        Score: <span className="font-semibold">{item.score}</span> / {item.max_score}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t pt-4">
                  <p className="mb-2 font-semibold text-sm sm:text-base">
                    Total Score: {reportData.total_score} / {reportData.max_score}
                  </p>
                  <p className="mb-2 text-sm sm:text-base">Result: {reportData.result}</p>
                  <p className="mb-4 text-sm sm:text-base">Recommendations: {reportData.recommendations}</p>
                  <button onClick={handleEndTest} className="w-full py-2 sm:py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm sm:text-base">
                    Proceed
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartGeneralInterview;
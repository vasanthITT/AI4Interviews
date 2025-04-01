import React from "react";
import "../index.css";

const Home = () => {
  return (
    <div className="min-h-[80vh]  lg:p-11 bg-white flex flex-col justify-center items-center  p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300  lg:w-[100%] md:w-40 sm:w-80 ">
      {/* Hero Section */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 leading-tight">
        AI Efficiency + Human Expertise = Perfect Hiring!
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-700 mt-2 sm:mt-4 text-center">
        Try Intraintec’s Hybrid Interview Solution.
      </p>
      
      {/* Images and Sections */}
      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 w-full max-w-5xl">
        <div className="w-full sm:w-1/2 max-w-md text-center">
          <img 
            src="https://interview.intraintech.com/wp-content/uploads/2024/08/ai-generated-8015425_1280-1-1024x1024.jpg" 
            alt="AI Interview Bot" 
            className="w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem] h-auto object-cover rounded-lg shadow-lg mx-auto"
          />
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-3 sm:mt-4">
            Want to practice seamlessly for interviews?
          </p>
          <a 
            href="/ai-interview-test" 
            className="text-blue-600 font-semibold text-sm sm:text-base md:text-lg hover:underline"
          >
            Try our Interview Bot
          </a>
        </div>

        <div className="w-full sm:w-1/2 max-w-md text-center">
          <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/online-interview-2161930-1816236.png" 
            alt="Human Interview" 
            className="w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem] h-auto object-cover rounded-lg shadow-lg mx-auto"
          />
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-3 sm:mt-4">
            Want to gain real-time experience with a person?
          </p>
          <a 
            href="/live-interview" 
            className="text-blue-600 font-semibold text-sm sm:text-base md:text-lg hover:underline"
          >
            Try out Human Interview
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
import React from "react";
import { useNavigate } from "react-router-dom";

function Help() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center h-screen mt-10">
        <div className="max-w-lg p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-white mb-4">Using Voice Recognition  :
          <span className="text-blue-800 text-center"> SyGenie</span></h2>
          <p className="text-white text-lg mb-4">To use voice recognition, follow these steps:</p>
          <ol className="list-decimal pl-6 text-white font-bold">
            <li className="mb-2">Click on the microphone icon to start listening.</li>
            <li className="mb-2">Speak clearly and audibly towards your device's microphone.</li>
            <li className="mb-2">Wait for the system to process your voice input.</li>
            <li className="mb-2">Review the text transcript provided to ensure accuracy.</li>
            <li className="mb-2">Interact with the application based on the recognized commands.</li>
          </ol>
         <p className="text-white text-lg mt-4 font-medium">Additionally, you can use voice commands like "<span className="text-blue-900">Go to Team</span>" to navigate to the team section.</p>
          <p className="text-white text-lg mt-4 font-medium">You can also set the seat number by saying "<span className="text-blue-900">Set number to </span>".</p>
          <p className="text-white text-lg mt-4 font-medium">To scroll through the names of the teams, simply say "<span className="text-blue-900">Go to Team</span>".</p>
          <p className="text-white text-lg mt-4 font-medium">To navigate to any interface, just say its name. For example, "<span className="text-blue-900">Go to Matches</span>".</p>
          <p className="text-white text-lg mt-4 font-medium">Please note that SyGenie only responds to questions related to football, and make sure to start any question with "<span className="text-blue-900">Hello</span>".</p>
        </div>
      </div>
    </div>
  );
}

export default Help;

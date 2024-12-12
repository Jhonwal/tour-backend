import React from "react";

const DeclinedAlert = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14L14 10M14 14l-4-4m14 4a9.003 9.003 0 11-18.002 0A9.003 9.003 0 0122 12z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-red-500 mb-2">
          Status: Declined
        </h2>
        <p className="text-gray-700 mb-4">
          Unfortunately, your request has been declined. <br />
          Please contact our support team for more information or further assistance.
        </p>
        <p className="text-sm text-gray-500">
          We apologize for any inconvenience caused.
        </p>
      </div>
    </div>
  );
};

export default DeclinedAlert;

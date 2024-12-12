import React from "react";

const PendingAlert = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-orange-500 mb-2">
          Status: Pending
        </h2>
        <p className="text-gray-700 mb-4">
          Your request is being processed. <br />
          Our administrative team is reviewing your information.
        </p>
        <p className="text-sm text-gray-500">
          Thank you for your patience. We will notify you as soon as possible!
        </p>
      </div>
    </div>
  );
};

export default PendingAlert;

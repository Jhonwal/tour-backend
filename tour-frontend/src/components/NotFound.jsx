// src/NotFound.jsx
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <img 
        src="/images/waguer.png" 
        alt="Not Found" 
        className="mb-6 w-80 h-80 object-cover rounded-lg"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Sorry, the page you are looking for doesn't exist. Perhaps you would like to explore some of our featured destinations?
      </p>
      <a 
        href="/" 
        className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition duration-300"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;

import React from 'react';
import { Home, ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[10%] left-[10%] w-48 h-48 bg-orange-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-orange-300 rounded-full opacity-20 blur-3xl" />
      
      {/* Main Content */}
      <div className="relative h-screen flex flex-col items-center justify-center px-4">
        {/* 404 Large Background Number */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          <h1 className="text-[15rem] font-bold text-orange-100">404</h1>
        </div>

        {/* Content Container */}
        <div className="max-w-2xl mx-auto text-center space-y-6 z-10">
          {/* Main Title */}
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-orange-500">Oops!</h2>
            <h3 className="text-2xl font-semibold text-gray-800">Page Not Found</h3>
          </div>

          {/* Image Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-orange-500 rounded-lg opacity-70 blur group-hover:opacity-100 transition duration-300" />
            <div className="relative">
              <img
                src="/images/waguer.png"
                alt="Lost Traveler"
                className="w-48 h-48 object-cover rounded-lg shadow-xl mx-auto transform group-hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-xl text-gray-700 font-medium">
              Looks like we've taken a wrong turn!
            </p>
            <p className="text-gray-600">
              Don't worry, adventure awaits at every corner.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-4 justify-center items-center">
            <a
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span className="font-semibold">Home</span>
            </a>
            <a
              href="/blog"
              className="flex items-center gap-2 px-6 py-3 bg-white text-orange-500 rounded-xl hover:bg-orange-50 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-2 border-orange-200"
            >
              <Compass className="w-4 h-4" />
              <span className="font-semibold">Explore Morocco</span>
            </a>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors duration-300 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
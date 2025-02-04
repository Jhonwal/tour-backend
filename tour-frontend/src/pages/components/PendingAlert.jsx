import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

const PendingAlert = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        
        <div className="relative">
          {/* Loading spinner container */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              
              {/* Inner pulsing circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full animate-pulse">
                  <Clock className="w-6 h-6 text-orange-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-2">
              <span>Status: Pending</span>
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </h2>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 my-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-gray-700 text-lg">
                Your request is being processed
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <p>Administrative team review in progress</p>
              </div>
              <p className="text-sm text-gray-500 mt-4 italic">
                Thank you for your patience. We will notify you as soon as possible!
              </p>
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1 bg-orange-500 mt-6 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PendingAlert;
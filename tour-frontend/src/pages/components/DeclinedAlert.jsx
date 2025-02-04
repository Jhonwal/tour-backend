import React from "react";
import { motion } from "framer-motion";
import { XCircle, AlertTriangle, PhoneCall, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeclinedAlert = () => {
  // Define phone number and email for support
  const supportPhoneNumber = "+1234567890"; // Replace with your support phone number
  const supportEmail = "support@example.com"; // Replace with your support email

  // Function to handle the "Call Support" button click
  const handleCallSupport = () => {
    window.location.href = `tel:${supportPhoneNumber}`;
  };

  // Function to handle the "Email Us" button click
  const handleEmailSupport = () => {
    window.location.href = `mailto:${supportEmail}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />

        <div className="relative">
          {/* Icon animation container */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <XCircle className="w-12 h-12 text-red-500" />
                </motion.div>
              </div>

              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping opacity-20" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-red-500 flex items-center justify-center gap-2">
              <span>Status: Declined</span>
              <AlertTriangle className="w-6 h-6" />
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-gray-700 text-lg">
                Unfortunately, your request has been declined.
              </p>

              {/* Contact options */}
              <div className="bg-red-50 rounded-lg p-4 space-y-3">
                <p className="text-gray-700 font-medium">Contact our support team:</p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-red-100 transition-colors"
                    onClick={handleCallSupport} // Add onClick handler for call
                  >
                    <PhoneCall className="w-4 h-4 text-red-500" />
                    <span>Call Support</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-red-100 transition-colors"
                    onClick={handleEmailSupport} // Add onClick handler for email
                  >
                    <Mail className="w-4 h-4 text-red-500" />
                    <span>Email Us</span>
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-500 italic">
                We apologize for any inconvenience caused.
              </p>
            </motion.div>
          </motion.div>

          {/* Additional help section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 pt-6 border-t border-red-100"
          >
            <div className="text-sm text-gray-600">
              <p className="font-medium text-red-600 mb-2">Common reasons for decline:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Incomplete or incorrect information</li>
                <li>Booking date availability issues</li>
                <li>Payment verification needed</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeclinedAlert;
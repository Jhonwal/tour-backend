import React from 'react';
import { ArrowRight, Compass, Calendar, Users, Map } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PersonalizedTourPromo = () => {

  const features = [
    {
      icon: <Compass className="h-6 w-6 text-orange-600" />,
      title: "Custom Itineraries",
      description: "Tailor your journey to match your interests and preferences"
    },
    {
      icon: <Calendar className="h-6 w-6 text-orange-600" />,
      title: "Flexible Scheduling",
      description: "Choose your perfect travel dates and duration"
    },
    {
      icon: <Users className="h-6 w-6 text-orange-600" />,
      title: "Group Customization",
      description: "Perfect for families, couples, or solo travelers"
    },
    {
      icon: <Map className="h-6 w-6 text-orange-600" />,
      title: "Unique Destinations",
      description: "Discover hidden gems and popular attractions"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white py-16">
      {/* Background Pattern */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Main Content */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-orange-600 mb-4"
            {...fadeInUp}
          >
            Create Your Dream Journey
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-700 max-w-2xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Design a personalized tour that perfectly matches your travel style, interests, and dreams.
            Let us help you create unforgettable memories.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="bg-orange-600 rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">
            Take the first step towards your perfect journey. Fill out our personalization form
            and let our experts craft the perfect itinerary for you.
          </p>
          <Link to="/get-quote">
            <Button
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold text-lg px-8 py-6 rounded-full"
            >
              Personalize Your Tour
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalizedTourPromo;
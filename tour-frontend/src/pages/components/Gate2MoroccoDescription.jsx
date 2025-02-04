import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Mail, MapPin, Award, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const InfoCard = ({ image, name, description, email, facebook, instagram }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
    <div className="relative h-48">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
      <p className="text-gray-600 mb-4 text-sm">{description}</p>
      <div className="flex space-x-4">
        <a href={`mailto:${email}`} className="text-orange-500 hover:text-orange-600 transition-colors">
          <Mail className="w-5 h-5" />
        </a>
        <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 transition-colors">
          <Facebook className="w-5 h-5" />
        </a>
        <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 transition-colors">
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    </div>
  </div>
);

const TeamCarousel = ({ teamMembers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div className="overflow-hidden relative rounded-xl">
        <div
          className={`transform transition-transform duration-500 ease-in-out flex`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {teamMembers.map((member, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <InfoCard {...member} />
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
      >
        <ChevronLeft className="w-6 h-6 text-orange-500" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-10"
      >
        <ChevronRight className="w-6 h-6 text-orange-500" />
      </button>

      <div className="flex justify-center mt-4 space-x-2">
        {teamMembers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-orange-500 w-4' : 'bg-orange-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
    <Icon className="w-8 h-8 text-orange-500 mb-2" />
    <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    <p className="text-2xl font-bold text-orange-600">{value}</p>
  </div>
);

const Gate2MoroccoDescription = () => {
  const teamMembers = [
    {
      image: './images/Rabat.webp',
      name: 'John Doe',
      description: 'Travel expert with over 10 years of experience in crafting unique Moroccan adventures.',
      email: 'john.doe@example.com',
      facebook: 'https://facebook.com/johndoe',
      instagram: 'https://instagram.com/johndoe'
    },
    {
      image: './images/Rabat.webp',
      name: 'Jane Smith',
      description: 'Specialist in Moroccan culture and heritage tours with extensive local knowledge.',
      email: 'jane.smith@example.com',
      facebook: 'https://facebook.com/janesmith',
      instagram: 'https://instagram.com/janesmith'
    },
    {
      image: './images/Rabat.webp',
      name: 'Ahmed Hassan',
      description: 'Desert expedition expert with deep knowledge of Sahara tours and adventures.',
      email: 'ahmed.hassan@example.com',
      facebook: 'https://facebook.com/ahmedhassan',
      instagram: 'https://instagram.com/ahmedhassan'
    }
  ];

  const stats = [
    { icon: Users, title: 'Happy Clients', value: '1000+' },
    { icon: MapPin, title: 'Destinations', value: '50+' },
    { icon: Clock, title: 'Years Experience', value: '15+' },
    { icon: Award, title: 'Awards Won', value: '20+' }
  ];

  return (
    <section className="py-12 px-4 lg:px-16 bg-orange-50 bg-opacity-40">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold font-verdana text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-md">
            About Us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <TeamCarousel teamMembers={teamMembers} />
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-6 relative">
                Sharmin Morocco tours: Your Gateway to Authentic Moroccan Adventures
              </h2>

              <div className="space-y-6 text-gray-600 relative">
                <p className="leading-relaxed">
                  Welcome to <span className="font-semibold text-orange-600">Sharmin Morocco tours</span>, 
                  your premier travel partner for exploring the rich cultural tapestry and breathtaking 
                  landscapes of Morocco. As a leading tourism agency, we specialize in crafting unforgettable 
                  experiences that capture the essence of this vibrant North African gem.
                </p>

                <p className="leading-relaxed">
                  Our expert team is dedicated to providing personalized travel solutions that cater to your 
                  unique interests and preferences. From the bustling souks of Marrakech and the ancient ruins 
                  of Fes to the majestic Atlas Mountains and the serene Sahara Desert, we offer a diverse 
                  range of curated tours and activities.
                </p>

                <p className="leading-relaxed">
                  At <span className="font-semibold text-orange-600">Sharmin Morocco tours</span>, we pride ourselves 
                  on our deep local knowledge and commitment to exceptional service. Whether you're seeking a 
                  luxurious getaway, an adventurous journey, or an immersive cultural experience, we are here 
                  to ensure your Moroccan adventure is nothing short of extraordinary.
                </p>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-lg font-semibold text-orange-600">
                    Your adventure starts here! Let us be your guide to discovering the enchanting beauty 
                    and rich heritage of Morocco.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gate2MoroccoDescription;
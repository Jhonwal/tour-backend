import React from 'react';
import { Link } from 'react-router-dom';

const SpecialOffersSection = () => {
  return (
    <section className="py-16 w-full bg-orange-50 bg-opacity-45">
      <div className="w-full px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl shadow-lg">
            Special Offers
        </h2>
        
        <div className="group relative max-w-7xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 transform -skew-y-3 rounded-2xl shadow-xl opacity-75"></div>
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-12 rounded-2xl shadow-xl text-center transform transition-transform duration-300 hover:-translate-y-2">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-white mb-6">
                Limited Time Seasonal Promotion
              </h3>
              
              <p className="text-orange-50 text-xl max-w-3xl mx-auto leading-relaxed">
                Experience the magic of Morocco with our exclusive seasonal discount. 
                Embark on an unforgettable journey through ancient medinas, 
                vast deserts, and stunning coastal towns.
              </p>
              <Link to={'/promotions'}>
                <button className="mt-8 bg-white text-orange-600 px-12 py-4 rounded-full font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50">
                  Claim Your Discount
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;
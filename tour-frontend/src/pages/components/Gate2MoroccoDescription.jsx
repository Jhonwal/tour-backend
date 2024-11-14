import InfoCard from './infoCard';

const Gate2MoroccoDescription = () => {
  const userInfo = {
    image: './images/Rabat.webp',
    name: 'John Doe',
    description: 'Welcome to Gate2Morocco, your premier travel partner for exploring the rich cultural tapestry and breathtaking landscapes of Morocco. As a leading tourism agency, we specialize in crafting unforgettable experiences that capture the essence of this vibrant North African gem.',
    email: 'john.doe@example.com',
    facebook: 'https://facebook.com/johndoe',
    instagram: 'https://instagram.com/johndoe'
  };
  return (
    <section className="py-6 px-6 lg:px-16">
      <div className="flex justify-center bg-orange-600 opacity-95">
        <div className='w-2/5 pb-4'>
          <InfoCard {...userInfo}/>
        </div>
        <div className="bg-red-200 w-3/5 opacity-75 shadow-lg px-8 lg:p-12 mt-4 mr-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Gate2Morocco: Your Gateway to Authentic Moroccan Adventures</h2>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to <span className="font-semibold text-indigo-600">Gate2Morocco</span>, your premier travel partner for exploring the rich cultural tapestry and breathtaking landscapes of Morocco. As a leading tourism agency, we specialize in crafting unforgettable experiences that capture the essence of this vibrant North African gem.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our expert team is dedicated to providing personalized travel solutions that cater to your unique interests and preferences. From the bustling souks of Marrakech and the ancient ruins of Fes to the majestic Atlas Mountains and the serene Sahara Desert, we offer a diverse range of curated tours and activities.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            At <span className="font-semibold text-indigo-600">Gate2Morocco</span>, we pride ourselves on our deep local knowledge and commitment to exceptional service. Whether you're seeking a luxurious getaway, an adventurous journey, or an immersive cultural experience, we are here to ensure your Moroccan adventure is nothing short of extraordinary.
          </p>
          <p className="text-lg text-gray-700">
            Embark on a journey with <span className="font-semibold text-indigo-600">Gate2Morocco</span> and let us be your guide to discovering the enchanting beauty and rich heritage of Morocco. Your adventure starts here!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gate2MoroccoDescription;

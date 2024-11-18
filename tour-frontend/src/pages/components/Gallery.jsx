// components/Gallery.js

import React, { useState } from 'react';
import Modal from 'react-modal';

const Gallery = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Image Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg shadow-lg"
            onClick={() => openModal(image)}
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 transform hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Modal for viewing image in larger size */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="flex justify-center items-center bg-opacity-50 bg-black p-4"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white p-6 rounded-lg max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-4">{currentImage ? currentImage : ''}</h2>
          <img
            src={currentImage}
            alt="Modal View"
            className="w-full h-auto max-w-xl mx-auto mb-4"
          />
          <button
            onClick={closeModal}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Gallery;

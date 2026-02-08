import React from 'react';

const ThankYouPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-light-gray rounded-xl p-8 w-96 text-center animate-scaleIn">
        <h2 className="text-3xl font-bold text-primary-orange mb-4">
          🎉 Thank You!
        </h2>
        <p className="text-off-white mb-6">
          Your order has been placed successfully.  
          We appreciate your purchase ❤️
        </p>
        <button
          onClick={onClose}
          className="bg-primary-orange text-dark-gray px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ThankYouPopup;

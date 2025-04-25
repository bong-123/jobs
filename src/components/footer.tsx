import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Develop By. Carl Christian C. Filipinas</p>
      </div>
    </footer>
  );
};

export default Footer;

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Removed isLoggedIn and user logic since they're unused
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center fixed top-0 z-50">
      <h2 className="text-xl font-bold text-gray-800">Job Application Tracker</h2>

      {/* Hamburger for mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-2xl text-gray-700"
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation */}
      <nav
        className={`flex flex-col md:flex-row md:items-center gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow md:shadow-none transition-all duration-200 ${
          isMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <Link href="/" className="text-gray-600 font-semibold hover:text-red-800">
          Home
        </Link>
        <Link href="/job" className="text-gray-600 font-semibold hover:text-red-800">
          Jobs
        </Link>
        <Link href="/registration" className="text-gray-600 font-semibold hover:text-red-800">
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default Header;
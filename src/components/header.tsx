'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<{ first_name?: string; last_name?: string; email?: string }>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowDropdown(false);
    router.push('/');
  };

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
        <Link href="/" className="relative group text-gray-600 font-semibold hover:text-red-800 transition-colors duration-300">
  Home
  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-800 transition-all group-hover:w-full"></span>
</Link>
<Link href="/job" className="relative group text-gray-600 font-semibold hover:text-red-800 transition-colors duration-300">
  Jobs
  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-800 transition-all group-hover:w-full"></span>
</Link>

        

{isLoggedIn ? (
  <div className="relative" ref={dropdownRef}>
    <button onClick={() => setShowDropdown(!showDropdown)}>
      <FaUserCircle className="text-2xl text-gray-700 hover:text-red-800" />
    </button>
    {showDropdown && (
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md p-4 z-50">
        <p className="text-sm text-gray-700 font-semibold mb-1">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-sm text-gray-500 mb-2">{user.email}</p>
        <hr className="my-2" />
        <Link
          href="/applications"
          className="text-sm text-gray-700 hover:text-red-700 block mb-2"
          onClick={() => setShowDropdown(false)}
        >
          Applications
        </Link>
        <Link
          href="/profile"
          className="text-sm text-gray-700 hover:text-red-700 block mb-2"
          onClick={() => setShowDropdown(false)}
        >
          View Profile
        </Link>
        
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Log Out
        </button>
      </div>
    )}
  </div>
) : (
  <Link
    href="/login"
    className="relative group text-gray-600 font-semibold hover:text-red-800 transition-colors duration-300"
  >
    Log In
    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-800 transition-all group-hover:w-full"></span>
  </Link>
)}

      </nav>
    </header>
  );
};

export default Header;

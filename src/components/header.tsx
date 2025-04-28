'use client';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow p-4 flex flex-col md:flex-row justify-between items-center fixed top-0 z-50">
      <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">
        Job Application Tracker
      </h2>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
        <Link href="/" className="text-gray-600 font-semibold hover:text-red-800">
          Home
        </Link>
        <Link href="/job" className="text-gray-600 font-semibold hover:text-red-800">
          Jobs
        </Link>
        <Link href="#" className="text-gray-600 font-semibold hover:text-red-800">
          About Us
        </Link>
        <Link href="/login" className="text-gray-600 font-semibold hover:text-red-800">
          Log In
        </Link>
      </nav>
    </header>
  );
};

export default Header;

'use client';
import Link from 'next/link';
const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center fixed top-0">
      <h2 className="text-xl font-bold text-gray-800">Job Application Tracker</h2>
      <nav className="flex gap-4">
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
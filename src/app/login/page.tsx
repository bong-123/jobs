'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', formData);
      alert(res.data.message);
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      router.push('/');
    } catch (err) {
      // Specify AxiosError type with an optional response structure
      const error = err as AxiosError<{ error?: string }>;
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-400">
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
          <Link href="#" className="text-gray-600 font-semibold hover:text-red-800">
            Log In
          </Link>
        </nav>
      </header>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-black">
        <h2 className="text-2xl text-block-600 font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Don&apos;t have an account?{' '}
          <span
            onClick={() => router.push('/registration')}
            className="text-purple-600 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
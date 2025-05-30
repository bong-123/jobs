'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';


const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    contact: '',
    address: '',
    gender: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/register/', formData);
      alert(res.data.message);
      router.push('/login');
    } catch (err: unknown) {
      // Specify a more precise type or handle error explicitly
      const error = err as { response?: { data?: string | object } };
      alert(JSON.stringify(error.response?.data || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-400">
      <Header />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="middle_name"
            placeholder="Middle Name"
            onChange={handleChange}
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="contact"
            placeholder="Contact"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="gender"
            placeholder="Gender"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="p-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
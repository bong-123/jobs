'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import Footer from '../components/footer';

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-800 flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-white mt-20 mb-6">Job Application Tracker</h1>
        <p className="text-lg text-gray-200 mb-8">Stay organized and track your job applications effortlessly.</p>

        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">About Job Application Tracker</h2>
          <p className="text-gray-600">
            The Job Application Tracker helps you stay on top of your job hunt by keeping all your applications, interviews, and offers organized in one place. Say goodbye to messy spreadsheets and scattered notes — track your progress smoothly and efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Applied Jobs</h2>
            <p className="text-gray-500">Keep track of the jobs you&apos;ve applied to.</p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Interviews</h2>
            <p className="text-gray-500">Monitor upcoming interviews and prepare accordingly.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Offers</h2>
            <p className="text-gray-500">Track job offers and make informed decisions.</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/job')}
          className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
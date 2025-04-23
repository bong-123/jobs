"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Define interfaces for TypeScript
interface Position {
  id: number;
  jobcategory: string;
  title: string;
}

interface Company {
  id: number;
  name: string;
  location: string;
  mode: string;
  salary: string | null;
  date_applied: string;
  position: Position;
}

const CompaniesByCategory = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");


  // Fetch job categories
  useEffect(() => {
    axios.get<Position[]>("http://localhost:8000/api/positions/").then((res) => {
      const uniqueCategories = Array.from(
        new Set(res.data.map((pos) => pos.jobcategory))
      );
      setCategories(uniqueCategories);
    });
    
  }, []);

  // Fetch companies based on selected category
  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `http://localhost:8000/api/companies/by-category/${encodeURIComponent(selectedCategory)}/`
      : `http://localhost:8000/api/companies/`;

    axios
      .get(url)
      .then((res) => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch companies:", err);
        setLoading(false);
      });
  }, [selectedCategory]);

 

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800">
      {/* Fixed Header */}
  <header className="w-full bg-white shadow p-4 flex justify-between items-center fixed top-0 left-0 z-50">
    <h2 className="text-xl font-bold text-gray-800">Job Application Tracker</h2>
    <nav className="flex gap-4">
    <Link href="/" className="text-gray-600 font-semibold hover:text-red-800">Home</Link>
      <a href="/job" className="text-gray-600 font-semibold hover:text-red-800">Jobs</a>
      <a href="#" className="text-gray-600 font-semibold hover:text-red-800">About Us</a>
      <a href="/login" className="text-gray-600 font-semibold hover:text-red-800">Log In</a>
    </nav>
  </header>
  {/* Main Content Area */}
  <div className="pt-24">
      <div className="flex max-w-7xl mx-auto p-6 gap-8">
      
        {/* Left side - Job categories */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-72 bg-white rounded-xl shadow-lg p-6 sticky top-24 max-h-[80vh] overflow-auto"

        >
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Job Categories
          </h2>
          <ul className="space-y-2">
            <li>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`text-left w-full p-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-teal-500 text-white shadow-md"
                    : "bg-gray-100 text-slate-600 hover:bg-teal-100"
                }`}
              >
                All Jobs
              </motion.button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left w-full p-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-teal-500 text-white shadow-md"
                      : "bg-gray-100 text-slate-600 hover:bg-teal-100"
                  }`}
                >
                  {cat}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right side - Job listings */}
        <div className="flex-1">
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by Company, Position, Location, or Mode"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full max-w-sm"
          />
        </div>

          {/* Career Progress Widget */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-teal-500 to-coral-500 rounded-xl p-6 mb-6 text-white shadow-lg"
          >
            <h1 className="text-3xl font-bold">
              {selectedCategory ? `${selectedCategory} Jobs` : "Find Your Job"}
            </h1>
            <p className="mt-2">
              We Have {companies.length} job{companies.length !== 1 ? "s" : ""}! Keep Searching Your Job.
            </p>
          </motion.div>

          {/* Job Listings */}
          <AnimatePresence>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-64"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500 border-r-4 border-coral-500"></div>
              </motion.div>
            ) : (
              <ul className="space-y-6">
                {companies
                .filter((company) => {
                  const name = company.name?.toLowerCase() || "";
                  const location = company.location?.toLowerCase() || "";
                  const mode = company.mode?.toLowerCase() || "";
                  const title = company.position?.title?.toLowerCase() || "";
                  const query = searchQuery.toLowerCase().trim();
                
                  return name.includes(query) || location.includes(query) || mode.includes(query) || title.includes(query);
                })
                
                .map((company) => (

                  <motion.li
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                          {company.position.title}
                        </h2>
                        <p className="text-coral-600 font-medium">{company.name}</p>
                        <p className="text-gray-600">{company.location}</p>
                      </div>
                    
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <p>Mode: {company.mode}</p>
                      {company.salary && (
                        <p>Salary: ₱{parseFloat(company.salary).toLocaleString()}</p>
                      )}
                      <p>
                        Date Posted: {new Date(company.date_applied).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/details/${company.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="mt-4 text-teal-500 font-medium hover:underline"
                      >
                        View Details
                      </motion.button>
                    </Link>

                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CompaniesByCategory;
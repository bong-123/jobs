"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { motion, AnimatePresence } from "framer-motion";

// Interfaces with optional position to match potential API response
interface EmployeePosition {
  id: number;
  title: string;
}

interface Position {
  id: number;
  title: string;
  jobcategory: string;
}

interface Company {
  id: number;
  name: string;
  location: string;
  mode: string;
  salary: string | null;
  date_applied: string;
  employee_position: EmployeePosition | null; // ✅ Correct field
}

const CompaniesByCategory = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleApply = (companyId: number) => {
    console.log("Navigating to apply with companyId:", companyId);
    if (!Number.isInteger(companyId) || companyId <= 0) {
      alert("Invalid company ID.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to apply for a job.");
      router.push(`/login?redirect=/apply/${companyId}`);
    } else {
      router.push(`/apply/${companyId}`);
    }
  };

  useEffect(() => {
    axios
      .get<Position[]>("http://localhost:8000/api/positions/")
      .then((res) => {
        const uniqueCategories = Array.from(
          new Set(res.data.map((pos) => pos.jobcategory))
        );
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `http://localhost:8000/api/companies/by-category/${encodeURIComponent(selectedCategory)}/`
      : `http://localhost:8000/api/companies/`;

    axios
      .get<Company[]>(url)
      .then((res) => {
        console.log("Companies data:", res.data);
        // Filter out companies with missing or invalid position
        const validCompanies = res.data.filter(
          (company) => company.employee_position && company.employee_position.title
        );


        setCompanies(validCompanies);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch companies:", err);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800">
      <Header />
      <div className="pt-24">
        <div className="flex max-w-7xl mx-auto p-6 gap-8">
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
                We Have {companies.length} job
                {companies.length !== 1 ? "s" : ""}! Keep Searching Your Job.
              </p>
            </motion.div>

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
              ) : companies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-600"
                >
                  <p>No jobs found for this category.</p>
                </motion.div>
              ) : (
                <ul className="space-y-6">
                  {companies
                    .filter((company) => {
                      const name = company.name?.toLowerCase() || "";
                      const location = company.location?.toLowerCase() || "";
                      const mode = company.mode?.toLowerCase() || "";
                      const title = company.employee_position?.title?.toLowerCase() || "";
                      const query = searchQuery.toLowerCase().trim();

                      return (
                        name.includes(query) ||
                        location.includes(query) ||
                        mode.includes(query) ||
                        title.includes(query)
                      );
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
                              {company.employee_position?.title || "No Position Title"}
                            </h2>

                            <p className="text-coral-600 font-medium">
                              {company.name}
                            </p>
                            <p className="text-gray-600">{company.location}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <p>Mode: {company.mode}</p>
                          {company.salary && (
                            <p>
                              Salary: ₱{parseFloat(company.salary).toLocaleString()}
                            </p>
                          )}
                          <p>
                            Date Posted:{" "}
                            {new Date(company.date_applied).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <Link href={`/details/${company.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-teal-500 font-medium hover:underline"
                            >
                              View Details
                            </motion.button>
                          </Link>

                          <motion.button
                            onClick={() => handleApply(company.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                          >
                            Apply Now
                          </motion.button>
                        </div>
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
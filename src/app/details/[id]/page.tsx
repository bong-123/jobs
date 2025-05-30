"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import axios from "axios";
import { Briefcase, MapPin, CalendarDays, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Interfaces
interface Position {
  id: number;
  jobcategory: string;
}

interface EmployeePosition {
  id: number;
  title: string;
  position: Position;
}

interface Company {
  id: number;
  name: string;
  location: string;
  mode: string;
  salary: string | null;
  salarystatus: string | null;
  date_applied: string;
  details: string;
  qualifications: string;
  benefits: string;
  image?: string;
  location_image?: string;
  employee_position: EmployeePosition;
}


const CompaniesByCategory = () => {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState<string[]>([]);
  // Removed setSelectedCategory since it's unused
  const [selectedCategory] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");


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
    axios.get<Position[]>("http://localhost:8000/api/positions/").then((res) => {
      const uniqueCategories = Array.from(
        new Set(res.data.map((pos) => pos.jobcategory))
      );
      setCategories(uniqueCategories);
    });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/companies/${id}/`).then((res) => {
      setCompany(res.data);
    });
  }, [id]);

  if (!company)
    return (
      <p className="p-6 text-center text-lg text-gray-500">Loading details...</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800">
      <Header />
      {/* Adjust for header height */}
      <div className="pt-32 max-w-7xl mx-auto px-6">
        <div className="flex justify-end mb-6">
          <input
            type="text"
            placeholder="Search job categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full max-w-sm"
          />
        </div>

        <div className="flex gap-8">
          {/* Left side - Job categories */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-72 bg-white rounded-xl shadow-lg p-6 sticky top-32 max-h-[80vh] overflow-auto"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Job Categories</h2>
            <ul className="space-y-2">
              <li>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/job")}
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
                    onClick={() =>
                      router.push(`/job?category=${encodeURIComponent(cat)}`)
                    }
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

          {/* Right side - Company details */}
<motion.div
  className="flex-1 bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {/* Company Logo */}
  {company.image && (
    <div className="w-full h-70 relative mb-4 shadow-md rounded-lg overflow-hidden">
      <Image
        src={company.image}
        alt={`${company.name} logo`}
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
        unoptimized
        priority
      />
    </div>
  )}

  <h1 className="text-4xl font-bold text-gray-800 mb-2">
    {company.employee_position?.title || "No Position Title"}
  </h1>


  <p className="text-xl font-bold text-gray-800 mb-1">{company.name}</p>
  <p className="text-sm text-teal-600 mb-4 italic">
    {company.employee_position?.position?.jobcategory || "No Job Category"}
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-gray-700">
    <div className="flex items-center gap-2">
      <MapPin className="w-5 h-5 text-blue-500" />
      <span>{company.location}</span>
    </div>
    <div className="flex items-center gap-2">
      <Briefcase className="w-5 h-5 text-green-500" />
      <span>{company.mode}</span>
    </div>
    {company.salary && (
      <div className="flex items-center gap-2">
        <Banknote className="w-5 h-5 text-yellow-500" />
        <span>₱{parseFloat(company.salary).toLocaleString()}</span>
      </div>
    )}
    {company.salarystatus && (
      <div className="flex items-center gap-2">
        <Banknote className="w-5 h-5 text-gray-500" />
        <span>{company.salarystatus}</span>
      </div>
    )}
    <div className="flex items-center gap-2">
      <CalendarDays className="w-5 h-5 text-purple-500" />
      <span>{new Date(company.date_applied).toLocaleDateString()}</span>
    </div>
  </div>

  <div className="mt-6 space-y-6 text-gray-700 leading-relaxed">
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">Job Details</h2>
    <p>{company.details || "No details provided."}</p>
  </div>
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">Qualifications</h2>
    <p>{company.qualifications || "No qualifications listed."}</p>
  </div>
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-1">Benefits</h2>
    <p>{company.benefits || "No benefits mentioned."}</p>
  </div>

  {/* Apply Now Button */}
  <motion.button
    onClick={() => handleApply(company.id)}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
  >
    Apply Now
  </motion.button>

  {/* Location Image */}
  {company.location_image && (
    <div className="pt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Company Location</h2>
      <div className="w-full h-64 relative rounded-xl shadow-md overflow-hidden">
        <Image
          src={company.location_image}
          alt="Company Location"
          fill
          style={{ objectFit: "cover" }}
          className="rounded-xl"
          unoptimized
        />
      </div>
    </div>
  )}
</div>


</motion.div>

        </div>
      </div>
    </div>
  );
};

export default CompaniesByCategory;

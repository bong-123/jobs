"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Briefcase, MapPin, CalendarDays, Banknote } from "lucide-react";
import { motion } from "framer-motion";

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
  salarystatus: string | null;
  date_applied: string;
  description: string;
  position: Position;
}

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/companies/${id}/`).then((res) => {
      setCompany(res.data);
    });
  }, [id]);

  if (!company)
    return <p className="p-6 text-center text-lg text-gray-500">Loading details...</p>;

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6 border border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{company.position.title}</h1>
      <p className="text-xl text-coral-600 font-medium mb-4">{company.name}</p>

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

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Description</h2>
        <p className="text-gray-600 leading-relaxed">
          {company.description || "No description available."}
        </p>
      </div>
    </motion.div>
  );
};

export default CompanyDetailsPage;

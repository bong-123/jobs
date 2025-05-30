"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Header from "@/components/header";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";

interface Company {
  id: number;
  name: string;
  employee_position: { title: string } | null;
}

const ApplyPage = () => {
  const router = useRouter();
  const { companyId } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    age: "",
    birthdate: "",
    full_current_location: "",
    job_level: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push(`/login?redirect=/apply/${companyId}`);
    }
  }, [companyId, router]);

  // Fetch company details
  useEffect(() => {
    if (companyId) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/api/companies/${companyId}/`)
        .then((res) => {
          setCompany(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch company:", err);
          setError("Failed to load company details.");
          setLoading(false);
        });
    }
  }, [companyId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push(`/login?redirect=/apply/${companyId}`);
      return;
    }

    // Validate companyId
    if (!companyId || isNaN(Number(companyId))) {
      setError("Invalid company ID.");
      return;
    }

    const data = new FormData();
    data.append("company_id", companyId as string); // Safe to cast since we validated
    data.append("age", formData.age);
    data.append("birthdate", formData.birthdate);
    data.append("full_current_location", formData.full_current_location);
    data.append("job_level", formData.job_level);
    if (resume) {
      data.append("resume", resume);
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8000/api/apply/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // setSuccess(response.data.message);
      // setTimeout(() => router.push("/applications"), 2000); // Redirect to applications page
    } catch (err: unknown) {
      let errorMsg = "Failed to submit application.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        // @ts-expect-error: axios error shape
        typeof err.response?.data === "object"
      ) {
        // @ts-expect-error: axios error shape
        errorMsg = err.response?.data?.detail || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800">
      <Header />
      <div className="pt-24 max-w-3xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-2xl font-bold text-slate-800 mb-6">
            Apply for {company?.employee_position?.title || "Job"} at {company?.name || "Company"}
          </h1>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500 border-r-4 border-coral-500"></div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {!loading && !success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birthdate
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Location
                </label>
                <input
                  type="text"
                  name="full_current_location"
                  value={formData.full_current_location}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Level
                </label>
                <select
                  name="job_level"
                  value={formData.job_level}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="" disabled>
                    Select Job Level
                  </option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Resume (PDF)
                </label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-600 transition-colors">
                    <FaUpload />
                    Upload Resume
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {resume && (
                    <span className="ml-4 text-sm text-gray-600">
                      {resume.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/job")}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ApplyPage;
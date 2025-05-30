"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/header";
import { motion } from "framer-motion";

interface Application {
  id: number;
  company: { id: number; name: string };
  job_level: string;
  status: string;
  date_applied: string;
}

interface JwtPayload {
  exp: number;
  user_id?: number;
}

const ApplicationsPage = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login?redirect=/applications");
    }
  }, [router]);

  const fetchApplications = async (token: string) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user-applications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
      setLoading(false);
    } catch (err: unknown) {
      let errorMessage = "Failed to load applications.";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        // @ts-expect-error: axios error shape
        typeof err.response?.data === "object"
      ) {
        // @ts-expect-error: axios error shape
        errorMessage = err.response?.data?.error || errorMessage;
        // @ts-expect-error: axios error shape
        console.error("Fetch applications error:", err.response?.data || err.message);
      } else if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Fetch applications error:", err.message);
      } else {
        console.error("Fetch applications error:", err);
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const initialToken = localStorage.getItem("authToken");
    if (!initialToken) return;

    let token: string = initialToken;
    const checkTokenAndFetch = async () => {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) {
            setError("Session expired. Please log in again.");
            router.push("/login?redirect=/applications");
            return;
          }
          try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
            token = response.data.access;
            localStorage.setItem("authToken", token);
            fetchApplications(token);
          } catch (refreshErr: unknown) {
            let errorMessage = "Unknown error";
            if (
              typeof refreshErr === "object" &&
              refreshErr !== null &&
              "response" in refreshErr
            ) {
              // @ts-expect-error: axios error shape
              errorMessage = refreshErr.response?.data || refreshErr.message;
            } else if (refreshErr instanceof Error) {
              errorMessage = refreshErr.message;
            }
            console.error("Token refresh error:", errorMessage);
            setError("Failed to refresh session. Please log in again.");
            router.push("/login?redirect=/applications");
          }
        } else {
          fetchApplications(token);
        }
      } catch (err) {
        console.error("Token decode error:", err);
        setError("Invalid token. Please log in again.");
        router.push("/login?redirect=/applications");
      }
    };

    checkTokenAndFetch();
    // Poll every 30 seconds for updates
    const interval = setInterval(checkTokenAndFetch, 30000);
    return () => clearInterval(interval);
  }, [isClient, router]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800">
      <Header />
      <div className="pt-24 max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Applications</h1>

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

          {!loading && !error && applications.length === 0 && (
            <div className="text-center text-gray-600">
              You haven&apos;t applied to any companies yet.
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-sm font-semibold text-gray-700">Company</th>
                    <th className="p-4 text-sm font-semibold text-gray-700">Job Level</th>
                    <th className="p-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-sm font-semibold text-gray-700">Date Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-t">
                      <td className="p-4 text-sm text-gray-600">{app.company.name}</td>
                      <td className="p-4 text-sm text-gray-600">{app.job_level || "N/A"}</td>
                      <td className="p-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            app.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : app.status === "For Interview"
                              ? "bg-blue-100 text-blue-700"
                              : app.status === "For Exam"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(app.date_applied).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
"use client";

import { useState, Suspense } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        email: formData.email,
        password: formData.password,
      });

      // Store user and tokens in localStorage
      localStorage.setItem("authToken", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push(redirect);
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      setMessage(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800 flex items-center justify-center">
      <Header />
      <div className="pt-24 max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Log In</h2>
        {message && (
          <p
            className={`mb-4 text-sm text-center ${
              message.includes("successful") ? "text-teal-500" : "text-coral-500"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-teal-500 text-white p-2 rounded-lg shadow-md transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-600"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/registration")}
            className="text-teal-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
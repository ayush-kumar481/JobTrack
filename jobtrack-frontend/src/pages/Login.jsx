import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect already logged-in users to Dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const token = response.data.token;

      localStorage.setItem("token", token);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">JobTrack</h1>

          <p className="mt-2 text-slate-400">
            Organize your job search. Build your career.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>

          <p className="text-slate-400 mt-2 mb-6">
            Sign in to continue to JobTrack.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

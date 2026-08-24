import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", {
        email,
      });

      setSuccess(
        "If an account exists for this email, a password reset link has been sent.",
      );

      setEmail("");
    } catch (error) {
      console.error("Failed to request password reset:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to process your request.",
      );
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

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">
            Forgot your password?
          </h2>

          <p className="text-slate-400 mt-2 mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

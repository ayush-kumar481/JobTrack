import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setSuccess(
        "Password reset successfully. You can now log in with your new password.",
      );

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Failed to reset password:", error);

      setError(
        error.response?.data || "Unable to reset password. Please try again.",
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
            Reset your password and get back to your job search.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Reset Password</h2>

          <p className="text-slate-400 mt-2 mb-6">
            Enter your new password below.
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
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
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
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Login */}
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

export default ResetPassword;

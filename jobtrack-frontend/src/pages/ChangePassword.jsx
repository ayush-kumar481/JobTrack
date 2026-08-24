import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.put("/auth/change-password", formData);

      setSuccess(response.data || "Password changed successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);

      setError(
        error.response?.data || "Unable to change password. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center px-8">
          <h2 className="font-semibold">Change Password</h2>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Change Password</h1>

            <p className="text-slate-400 mt-2">
              Update your JobTrack account password.
            </p>
          </div>

          {/* Password Card */}
          <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-8">
            {/* Error */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  required
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  required
                  minLength={6}
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
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition"
                >
                  {saving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChangePassword;

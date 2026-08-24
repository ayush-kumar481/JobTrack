import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch account details:", error);

        setError("Unable to load account details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center px-8">
          <h2 className="font-semibold">My Account</h2>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>

            <p className="text-slate-400 mt-2">
              View and manage your JobTrack account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 max-w-xl rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-slate-400">Loading account details...</p>
          )}

          {/* Account Card */}
          {!loading && !error && user && (
            <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-8">
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>

                  <p className="text-slate-400">{user.email}</p>
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500">Name</p>

                  <p className="mt-1 text-slate-200">{user.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Email</p>

                  <p className="mt-1 text-slate-200">{user.email}</p>
                </div>
              </div>

              {/* Change Password */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <button
                  onClick={() => navigate("/change-password")}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Account;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    applied: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, applicationsResponse] = await Promise.all([
          api.get("/applications/stats"),
          api.get("/applications"),
        ]);

        setStats(statsResponse.data);
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentApplications = [...applications]
    .sort((a, b) => {
      const dateA = a.applicationDate || "";
      const dateB = b.applicationDate || "";

      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">
          <h2 className="font-semibold">Dashboard</h2>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Welcome back</span>

            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Overview</h1>

            <p className="text-slate-400 mt-2">
              Here's an overview of your job search.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            {/* Total */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Total Applications</p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : stats.totalApplications}
              </p>
            </div>

            {/* Applied */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Applied</p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : stats.applied}
              </p>
            </div>

            {/* Interviews */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Interviews</p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : stats.interviews}
              </p>
            </div>

            {/* Offers */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Offers</p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : stats.offers}
              </p>
            </div>

            {/* Rejected */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm">Rejected</p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : stats.rejected}
              </p>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-semibold">Recent Applications</h2>

                <p className="text-sm text-slate-400 mt-1">
                  Your latest job applications.
                </p>
              </div>

              <button
                onClick={() => navigate("/applications")}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                View All →
              </button>
            </div>

            {recentApplications.length > 0 ? (
              <div>
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    onClick={() => navigate(`/applications/${application.id}`)}
                    className="flex items-center justify-between px-6 py-4 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <div>
                      <p className="font-medium">{application.companyName}</p>

                      <p className="text-sm text-slate-400 mt-1">
                        {application.jobTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          application.status === "APPLIED"
                            ? "bg-blue-500/10 text-blue-400"
                            : application.status === "INTERVIEW"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : application.status === "OFFER"
                                ? "bg-green-500/10 text-green-400"
                                : application.status === "REJECTED"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {application.status}
                      </span>

                      <span className="text-sm text-slate-500">
                        {application.applicationDate || "No date"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-slate-400">No applications yet.</p>

                <p className="text-sm text-slate-500 mt-1">
                  Start tracking your job applications.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/applications/${id}`);

        setApplication(response.data);
      } catch (error) {
        console.error("Failed to fetch application:", error);

        setError("Unable to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/applications/${id}`);

      navigate("/applications");
    } catch (error) {
      console.error("Failed to delete application:", error);

      setError("Unable to delete application.");
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
          <h2 className="font-semibold">Application Details</h2>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/applications")}
            className="text-blue-400 hover:text-blue-300 mb-6"
          >
            ← Back to Applications
          </button>

          {/* Loading */}
          {loading && <p className="text-slate-400">Loading application...</p>}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {/* Application Details */}
          {!loading && !error && application && (
            <div className="max-w-3xl bg-slate-900 border border-slate-800 rounded-xl p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                {/* Job Information */}
                <div>
                  <h1 className="text-3xl font-bold">{application.jobTitle}</h1>

                  <p className="text-slate-400 mt-2">
                    {application.companyName}
                  </p>
                </div>

                {/* Actions + Status */}
                <div className="flex items-center gap-3">
                  {/* Edit */}
                  <button
                    onClick={() =>
                      navigate(`/applications/${application.id}/edit`)
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium transition"
                  >
                    Delete
                  </button>

                  {/* Status */}
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
                </div>
              </div>

              {/* Application Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Date */}
                <div>
                  <p className="text-sm text-slate-500">Application Date</p>

                  <p className="mt-1 text-slate-200">
                    {application.applicationDate || "Not provided"}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-slate-500">Location</p>

                  <p className="mt-1 text-slate-200">
                    {application.location || "Not provided"}
                  </p>
                </div>

                {/* Job Type */}
                <div>
                  <p className="text-sm text-slate-500">Job Type</p>

                  <p className="mt-1 text-slate-200">
                    {application.jobType || "Not provided"}
                  </p>
                </div>

                {/* Job URL */}
                <div>
                  <p className="text-sm text-slate-500">Job URL</p>

                  {application.jobUrl ? (
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-blue-400 hover:text-blue-300"
                    >
                      View Job Posting
                    </a>
                  ) : (
                    <p className="mt-1 text-slate-200">Not provided</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8">
                <p className="text-sm text-slate-500">Notes</p>

                <p className="mt-2 text-slate-300 whitespace-pre-wrap">
                  {application.notes || "No notes added."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ApplicationDetails;

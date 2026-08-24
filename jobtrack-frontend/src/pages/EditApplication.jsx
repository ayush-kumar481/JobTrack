import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    jobType: "",
    status: "APPLIED",
    applicationDate: "",
    jobUrl: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing application
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/applications/${id}`);

        const application = response.data;

        setFormData({
          companyName: application.companyName || "",
          jobTitle: application.jobTitle || "",
          location: application.location || "",
          jobType: application.jobType || "",
          status: application.status || "APPLIED",
          applicationDate: application.applicationDate || "",
          jobUrl: application.jobUrl || "",
          notes: application.notes || "",
        });
      } catch (error) {
        console.error("Failed to fetch application:", error);

        setError("Unable to load application.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Submit updated application
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await api.put(`/applications/${id}`, formData);

      navigate("/applications");
    } catch (error) {
      console.error("Failed to update application:", error);

      setError("Unable to update application.");
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
          <h2 className="font-semibold">Edit Application</h2>
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
            <div className="mb-6 max-w-3xl rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          {!loading && (
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl bg-slate-900 border border-slate-800 rounded-xl p-8"
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold">Edit Application</h1>

                <p className="text-slate-400 mt-2">
                  Update the details of your job application.
                </p>
              </div>

              {/* Company Name */}
              <div className="mb-5">
                <label className="block text-sm text-slate-300 mb-2">
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Job Title */}
              <div className="mb-5">
                <label className="block text-sm text-slate-300 mb-2">
                  Job Title
                </label>

                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Location + Job Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select Job Type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
              </div>

              {/* Status + Application Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Application Date
                  </label>

                  <input
                    type="date"
                    name="applicationDate"
                    value={formData.applicationDate}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Job URL */}
              <div className="mb-5">
                <label className="block text-sm text-slate-300 mb-2">
                  Job URL
                </label>

                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/job"
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="block text-sm text-slate-300 mb-2">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Add any notes about this application..."
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/applications")}
                  className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default EditApplication;

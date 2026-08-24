import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

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

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/applications");

      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);

      setError("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      companyName: "",
      jobTitle: "",
      location: "",
      jobType: "",
      status: "APPLIED",
      applicationDate: "",
      jobUrl: "",
      notes: "",
    });
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditingApplication(null);
    resetForm();
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      if (editingApplication) {
        // UPDATE
        await api.put(`/applications/${editingApplication.id}`, formData);
      } else {
        // CREATE
        await api.post("/applications", formData);
      }

      // Close form
      closeForm();

      // Refresh applications
      await fetchApplications();
    } catch (error) {
      console.error("Failed to save application:", error);

      setError(error.response?.data?.message || "Failed to save application.");
    } finally {
      setSaving(false);
    }
  };

  // Delete application
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/applications/${id}`);

      // Remove it from UI immediately
      setApplications((currentApplications) =>
        currentApplications.filter((application) => application.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete application:", error);

      setError(
        error.response?.data?.message || "Failed to delete application.",
      );
    }
  };

  // Edit application
  const handleEdit = (application) => {
    setEditingApplication(application);

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

    setShowForm(true);
  };

  // Search + status filter
  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase();

    const companyName = application.companyName?.toLowerCase() || "";

    const jobTitle = application.jobTitle?.toLowerCase() || "";

    const matchesSearch =
      companyName.includes(search) || jobTitle.includes(search);

    const matchesStatus =
      statusFilter === "ALL" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">
          <h2 className="font-semibold">Applications</h2>

          <button
            onClick={() => {
              setEditingApplication(null);
              resetForm();
              setShowForm(true);
              setError("");
            }}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Add Application
          </button>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Job Applications</h1>

            <p className="text-slate-400 mt-2">
              Track and manage all your job applications.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              {error}
            </div>
          )}

          {/* Add / Edit Form */}
          {showForm && (
            <div className="mb-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingApplication ? "Edit Application" : "Add Application"}
                </h2>

                <button
                  onClick={closeForm}
                  className="text-slate-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* Company */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Company
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Google"
                    required
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Position
                  </label>

                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    required
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore / Remote"
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select Job Type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {/* Application Date */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Application Date
                  </label>

                  <input
                    type="date"
                    name="applicationDate"
                    value={formData.applicationDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Job URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-300 mb-2">
                    Job URL
                  </label>

                  <input
                    type="url"
                    name="jobUrl"
                    value={formData.jobUrl}
                    onChange={handleChange}
                    placeholder="https://company.com/job-posting"
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-300 mb-2">
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any notes about this application..."
                    rows="4"
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                  >
                    {saving
                      ? "Saving..."
                      : editingApplication
                        ? "Save Changes"
                        : "Save Application"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-slate-400">Loading applications...</div>
          )}

          {/* Empty State */}
          {!loading && applications.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
              <h3 className="text-xl font-semibold">No applications yet</h3>

              <p className="text-slate-400 mt-2">
                Start tracking your job applications by adding your first one.
              </p>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="mt-6 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-medium transition"
              >
                + Add Your First Application
              </button>
            </div>
          )}

          {/* Search and Filter */}
          {!loading && applications.length > 0 && (
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by company or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg bg-slate-900 border border-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          )}

          {/* No Search Results */}
          {!loading &&
            applications.length > 0 &&
            filteredApplications.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
                <p className="text-slate-300 font-medium">
                  No applications found
                </p>

                <p className="text-slate-500 text-sm mt-2">
                  Try changing your search or status filter.
                </p>
              </div>
            )}

          {/* Applications Table */}
          {!loading && filteredApplications.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-800">
                    <tr className="text-left text-sm text-slate-400">
                      <th className="px-6 py-4">Company</th>

                      <th className="px-6 py-4">Position</th>

                      <th className="px-6 py-4">Status</th>

                      <th className="px-6 py-4">Applied Date</th>

                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr
                        key={application.id}
                        onClick={() =>
                          navigate(`/applications/${application.id}`)
                        }
                        className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 cursor-pointer transition"
                      >
                        {/* Company */}
                        <td className="px-6 py-4 font-medium">
                          {application.companyName}
                        </td>

                        {/* Position */}
                        <td className="px-6 py-4 text-slate-300">
                          {application.jobTitle}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
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
                        </td>

                        {/* Application Date */}
                        <td className="px-6 py-4 text-slate-400">
                          {application.applicationDate || "Not provided"}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(application);
                              }}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(application.id);
                              }}
                              className="text-red-400 hover:text-red-300 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Applications;

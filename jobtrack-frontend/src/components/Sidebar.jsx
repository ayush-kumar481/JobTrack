import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Applications",
      path: "/applications",
    },
    {
      name: "Account",
      path: "/account",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">JobTrack</h1>

        <p className="text-xs text-slate-500 mt-1">Job search, organized.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

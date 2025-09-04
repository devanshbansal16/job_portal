import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, setCompanyData, setCompanyToken, fetchCompanyData, companyToken } =
    useContext(AppContext);

  // Function to logout for company
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("recruiterToken");
    setCompanyData(null);
    navigate("/");
  };

  // Fetch company data on mount
  useEffect(() => {
    if (companyToken && !companyData) {
      fetchCompanyData();
    }
  }, [companyToken, companyData, fetchCompanyData]);

  // Redirect to manage-jobs on login ONLY if we're at the root dashboard
  useEffect(() => {
    if (companyData && window.location.pathname === "/dashboard") {
      navigate("/dashboard/manage-jobs", { replace: true });
    }
  }, [companyData, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.gem1}
            alt="Company Logo"
            className="h-12 object-contain"
          />
        </div>

        {/* Profile Dropdown */}
        {companyData && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="max-sm:hidden text-gray-700 font-medium">
                Welcome, {companyData.name}
              </span>
              {/* Company Logo */}
              {companyData.image ? (
                <img
                  src={(() => {
              const backendUrl = import.meta.env.VITE_BACKEND_URL;
              console.log('🏢 Dashboard - Backend URL:', backendUrl);
              console.log('🏢 Dashboard - Company data:', companyData);
              
              if (!companyData) {
                console.log('🏢 Dashboard - No company data, using default logo');
                return assets.default_company_logo;
              }
              if (companyData.imageUrl) {
                console.log('🏢 Dashboard - Using imageUrl:', `${backendUrl}/uploads/${companyData.image}`);
                return companyData.imageUrl;
              }
              if (companyData.image) {
                if (companyData.image.startsWith('http')) {
                  console.log('🏢 Dashboard - Using full URL:', companyData.image);
                  return companyData.image;
                }
                const constructedUrl = `${backendUrl}/uploads/${companyData.image}`;
                console.log('🏢 Dashboard - Constructed URL:', constructedUrl);
                return constructedUrl;
              }
              console.log('🏢 Dashboard - No image, using default logo');
              return assets.default_company_logo;
            })()}
                  alt="Company Logo"
                  className="w-8 h-8 rounded-full object-cover border"
                  onError={(e) => {
                    if (e.target) {
                      e.target.style.display = 'none';
                    }
                    if (e.target && e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
              ) : null}
              {!(companyData.image || companyData.imageUrl) && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  No file chosen
                </span>
              )}
            </div>
            
            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors px-3 py-1 rounded border border-gray-300 hover:border-red-300"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-white border-r px-2 md:px-4 py-6 shadow-sm">
          <ul className="space-y-2">
            <NavLink
              to="add-job"
              className={({ isActive }) =>
                `flex items-center gap-3 text-gray-700 p-3 rounded-md transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <img src={assets.add_icon} alt="Add Job" className="w-6 h-6" />
              <span className="hidden md:block">Add Job</span>
            </NavLink>

            <NavLink
              to="manage-jobs"
              className={({ isActive }) =>
                `flex items-center gap-3 text-gray-700 p-3 rounded-md transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <img src={assets.home_icon} alt="Manage Jobs" className="w-6 h-6" />
              <span className="hidden md:block">Manage Jobs</span>
            </NavLink>

            <NavLink
              to="view-applications"
              className={({ isActive }) =>
                `flex items-center gap-3 text-gray-700 p-3 rounded-md transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <img
                src={assets.person_tick_icon}
                alt="View Applications"
                className="w-6 h-6"
              />
              <span className="hidden md:block">View Applications</span>
            </NavLink>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

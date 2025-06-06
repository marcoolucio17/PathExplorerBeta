import { useState } from "react";
import { useNavigate } from "react-router";
import Logo from "../assets/Acc_GT_Dimensional_RGB 1.png";
import { SearchHeader } from "../components/SearchHeader";
import { Notifications } from "../components/Notifications";


import "./CustomNavBar.css";

function CustomNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const authState = localStorage.getItem("role");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define search categories
  const searchCategories = [
    { key: 'people', label: 'People', icon: 'people' },
    { key: 'projects', label: 'Projects', icon: 'projects' },
    { key: 'certificates', label: 'Certificates', icon: 'certificates' },
    { key: 'skills', label: 'Skills', icon: 'skills' },
    { key: 'applicants', label: 'Applicants', icon: 'people' } // Using people icon for applicants
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSearchResultClick = (searchValue, category) => {
    // Navigate to the appropriate search page based on the category
    switch (category) {
      case 'people':
        navigate(`/people/search?q=${encodeURIComponent(searchValue)}`);
        break;
      case 'projects':
        navigate(`/projects/search?q=${encodeURIComponent(searchValue)}`);
        break;
      case 'certificates':
        navigate(`/certificates/search?q=${encodeURIComponent(searchValue)}`);
        break;
      case 'skills':
        navigate(`/skills/search?q=${encodeURIComponent(searchValue)}`);
        break;
      case 'applicants':
        navigate(`/manager/applicants?search=${encodeURIComponent(searchValue)}`);
        break;
      default:
        // If there's no matching category, use a default
        navigate(`/search?q=${encodeURIComponent(searchValue)}`);
        break;
    }
  };

  const handleLogout = () => {
    // borramos tokens
    localStorage.clear();
    // salimos
    navigate("/");
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar 
          ${isSidebarVisible ? "sidebar-visible" : ""} 
          ${isSidebarOpen ? "open" : ""}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => {
          setIsSidebarOpen(false);
          setIsSidebarVisible(false);
        }}
      >
        <ul className="sidebar-menu">
          <li onClick={() => navigate(`${authState}`)}>
            <i className="bi bi-house"></i>
            {isSidebarOpen && <span>Home</span>}
          </li>
          <li onClick={() => navigate(`${authState}/dashboard`)}>
            <i className="bi bi-clipboard"></i>
            {isSidebarOpen && <span>Projects</span>}
          </li>
          <li onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            {isSidebarOpen && <span>Logout</span>}

          </li>
        </ul>
      </div>

      {/* Navbar */}
      <nav className="navbar glass-navbar navbar-expand-lg">
        <div className="container-fluid d-flex align-items-center">
          {/* Logo only */}
          <button
            onMouseEnter={() => setIsSidebarVisible(true)}
            className="navbar-brand btn btn-link p-0 nav-logo"
          >
            <img src={Logo} alt="Logo" className="logo-img" />
          </button>

          {/* Search bar with SearchHeader component */}
          <div className="nav-search-container">
            <SearchHeader
              searchTerm={searchTerm}
              setSearchTerm={handleSearch}
              placeholder="Search..."
              searchName="navSearch"
              inSearchBar={true}
              onSearchResultClick={handleSearchResultClick}
              searchCategories={searchCategories}
            />
          </div>

          {/* Icons */}
          <div className="nav-icons d-flex gap-3 align-items-center">

            <div className="position-relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="icon-btn"
              >
                <i className="bi bi-bell"></i>
                <span className="badge-notif">!</span>
              </button>

              <Notifications
                userId={localStorage.getItem("id")}
                visible={showNotifications}
              />
            </div>

            <button
              onClick={() => navigate(`/${authState}/perfil`)}
              className="icon-btn"
            >
              <i className="bi bi-person-circle"></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default CustomNavbar;
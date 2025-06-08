import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Logo from "../assets/Acc_GT_Dimensional_RGB 1.png";
import { SearchHeader } from "../components/SearchHeader";
import { Notifications } from "../components/Notifications";
import axios from "axios";

import "./CustomNavBar.css";

function CustomNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const authState = localStorage.getItem("role");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) return;

    axios
      .get(`https://pathexplorer-backend.onrender.com/api/notifications/${userId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          setNotifications([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching notifications", err);
        setNotifications([]);
      });
  }, []);

  const getSearchCategoriesByRole = (role) => {
    switch (role) {
      case 'empleado':
        return [
          { key: 'people', label: 'People', icon: 'people' },
          { key: 'projects', label: 'Projects', icon: 'projects' }
        ];
      case 'manager':
      case 'tfs':
        return [
          { key: 'people', label: 'People', icon: 'people' },
          { key: 'projects', label: 'Projects', icon: 'projects' },
          { key: 'applicants', label: 'Applicants', icon: 'applicants' }
        ];
      default:
        return [
          { key: 'people', label: 'People', icon: 'people' },
          { key: 'projects', label: 'Projects', icon: 'projects' }
        ];
    }
  };

  const searchCategories = getSearchCategoriesByRole(userRole);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSearchResultClick = (searchValue, category) => {
    console.log('handleSearchResultClick called with:', { searchValue, category, userRole });

    switch (userRole) {
      case 'empleado':
        switch (category) {
          case 'people':
            navigate(`/${userRole}/employee-dashboard?search=${encodeURIComponent(searchValue)}`);
            break;
          case 'projects':
            navigate(`/${userRole}/dashboard?search=${encodeURIComponent(searchValue)}`);
            break;
          default:
            navigate(`/search?q=${encodeURIComponent(searchValue)}`);
            break;
        }
        break;
      case 'manager':
        switch (category) {
          case 'people':
            navigate(`/${userRole}/employee-dashboard?search=${encodeURIComponent(searchValue)}`);
            break;
          case 'projects':
            navigate(`/${userRole}/dashboard?search=${encodeURIComponent(searchValue)}`);
            break;
          case 'applicants':
            navigate(`/${userRole}/applicants?search=${encodeURIComponent(searchValue)}`);
            break;
          default:
            navigate(`/search?q=${encodeURIComponent(searchValue)}`);
            break;
        }
        break;
      case 'tfs':
        switch (category) {
          case 'people':
            navigate(`/${userRole}/employee-dashboard?search=${encodeURIComponent(searchValue)}`);
            break;
          case 'projects':
            navigate(`/${userRole}/dashboard?search=${encodeURIComponent(searchValue)}`);
            break;
          case 'applicants':
            navigate(`/${userRole}/applicants?search=${encodeURIComponent(searchValue)}`);
            break;
          default:
            navigate(`/search?q=${encodeURIComponent(searchValue)}`);
            break;
        }
        break;
      default:
        console.log('No matching role found, using default navigation');
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
            ${isSidebarOpen ? "open" : ""}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => {
          setIsSidebarOpen(false);
        }}
      >
        <ul className="sidebar-menu">
          <li onClick={() => navigate(`/${authState}`)}>
            <i className="bi bi-house"></i>
            {isSidebarOpen && <span className="title-light">Home</span>}
          </li>
          <li onClick={() => navigate(`/${authState}/dashboard`)}>
            <i className="bi bi-clipboard"></i>
            {isSidebarOpen && <span className="title-light">Projects</span>}
          </li>
          <li onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            {isSidebarOpen && <span className="title-light">Logout</span>}
          </li>
        </ul>
      </div>


      {/* Navbar */}
      <nav className="navbar glass-navbar navbar-expand-lg">
        <div className="container-fluid d-flex align-items-center">
          {/* Logo only */}
          <button
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
            <div
              className="position-relative"
              onMouseLeave={() => setShowNotifications(false)}
            >
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="icon-btn"
              >
                <i className="bi bi-bell"></i>
                {notifications.length > 0 && <span className="badge-notif">!</span>}
              </button>

              <Notifications
                userId={localStorage.getItem("id")}
                visible={showNotifications}
                notifications={notifications}
                setNotifications={setNotifications}
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
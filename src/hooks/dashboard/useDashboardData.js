import { useState, useEffect, useMemo, act } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { all } from "axios";

export const useDashboardData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromURL = searchParams.get("search") || "";
  // Initialize state variables
  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  // State for selected filters
  const [skillSelected, setSkillSelected] = useState("Skills");
  // State for selected skill filters
  const [selectedSkillFilters, setSelectedSkillFilters] = useState([]);
  // State for client filters
  const [clientNameSelected, setClientNameSelected] = useState("Clients");
  // State for cliend id
  const [clientId, setClientId] = useState(null);
  // State for role filters
  const [roleNameSelected, setRoleNameSelected] = useState("Roles");
  // State for role id
  const [roleId, setRoleId] = useState(null);
  // Parameters for All projects
  const [filterOptions, setFilterOptions] = useState({
    idCompatible: localStorage.getItem("id"),
    type: true,
  });
  // Parameters for My projects
  const [filterOptionsMyProjects, setFilterOptionsMyProjects] = useState({
    idCompatible: localStorage.getItem("id"),
    idusuario: localStorage.getItem("id"),
  });
  // State for user skills
  const [userSkills, setUserSkills] = useState([]);
  // State for error fetching user skills
  const [errorUserSkills, setUserSkillsError] = useState(null);
  // State for currents projects All
  const [projectsData, setProjectsData] = useState([]);

  // State for boolean loading projects All
  const [projectsLoading, setProjectsLoading] = useState(true);
  // State for currents projects role applications
  const [myApplicationsData, setMyApplicationsData] = useState([]);

  // State for boolean loading projects Aplications
  const [applyLoading, setApplyLoading] = useState(true);
  // State for clients data
  const [clientsData, setClientsData] = useState([]);
  // State for error fetching clients
  const [errorClients, setClientsError] = useState(null);
  // State for roles data
  const [rolesData, setRolesData] = useState([]);
  // State for error fetching roles
  const [errorRoles, setRolesError] = useState(null);
  // State for top 3 projects data
  const [topData, setTopData] = useState([]);

  // State for error fetching top projects
  const [errorTopProjects, setTopError] = useState(null);
  // State for all error in projects
  const [allErrorProjectsDashboard, setAllErrorProjectsDashboard] = useState({
    All: null,
    "Applied To": null,
    "My Projects": null,
  });
  console.log(allErrorProjectsDashboard);
  useEffect(() => {
    if (searchTerm) {
      const params = new URLSearchParams(location.search);
      params.set("search", searchTerm);
      handdlyApplyNameProject(searchTerm);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else if (searchFromURL) {
      const params = new URLSearchParams(location.search);
      params.delete("search");
      handdlyApplyNameProject();
      navigate(
        `${location.pathname}${
          params.toString() ? `?${params.toString()}` : ""
        }`,
        { replace: true }
      );
    }
  }, [searchTerm, navigate, location.pathname, location.search, searchFromURL]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentSearchParam = params.get("search") || "";

    if (searchTerm && searchTerm !== currentSearchParam) {
      params.set("search", searchTerm);
      handdlyApplyNameProject(searchTerm);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else if (!searchTerm && currentSearchParam) {
      params.delete("search");
      handdlyApplyNameProject();
      navigate(
        `${location.pathname}${
          params.toString() ? `?${params.toString()}` : ""
        }`,
        { replace: true }
      );
    }
  }, [searchTerm, navigate, location.pathname]);

  // Url for the backend API in render
  let url = "https://pathexplorer-backend.onrender.com/api";
  let url2 = "http://localhost:8080/api";
  // Configuration for axios requests
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: filterOptions,
  };
  // Fetch projects All data when filter options change
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const { data } = await axios.get(`${url2}/projects/`, config);

        setProjectsData(data);
        setAllErrorProjectsDashboard((prev) => ({
          ...prev,
          All: null, // Clear error for All projects
        }));
      } catch (err) {
        console.error("Error fetching projects", err);

        setAllErrorProjectsDashboard((prev) => ({
          ...prev,
          All:
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.response?.data,
        }));
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [filterOptions]);

  // Fetch Roles, clients, top projects, my applications and my skills once

  useEffect(() => {
    //fetch roles
    axios
      .get(`${url}/roles`, config)
      .then((res) => setRolesData(res.data))
      .catch((err) => {
        console.error("Error fetching roles", err);
        setRolesError(err.response?.data?.message || err.response?.data?.error);
      });

    //get user top 3 projects compability
    const userId = localStorage.getItem("id");
    if (userId) {
      axios
        .get(`${url}/projects/top/${userId}`, config)
        .then((res) => {
          setTopData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching top projects", err);
          setTopError(err.response?.data?.message || err.response?.data?.error);
        });
    }

    //fetch clients
    axios
      .get(`${url}/clientes`, config)
      .then((res) => setClientsData(res.data))
      .catch((err) => {
        console.error("Error fetching clients", err);
        setClientsError(
          err.response?.data?.message || err.response?.data?.error
        );
      });

    //fetch user applications
    axios
      .get(`${url2}/apps/usuario/${localStorage.getItem("id")}`, config)
      .then((res) => {
        setMyApplicationsData(res.data);
        setApplyLoading(false);
        setAllErrorProjectsDashboard((prev) => ({
          ...prev,
          "Applied To": null, // Clear error for All projects
        }));
      })
      .catch((err) => {
        setApplyLoading(false);

        setAllErrorProjectsDashboard((prev) => ({
          ...prev,
          "Applied To":
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.response?.data,
        }));
      });

    //fetch user skills
    axios
      .get(`${url}/habilidades/usuario/${localStorage.getItem("id")}`, config)
      .then((res) => {
        setUserSkills(res.data.data.map((skill) => skill.nombre));
      })
      .catch((err) => {
        console.error("Error fetching user skills", err);
        setUserSkillsError(
          err.response?.data?.message || err.response?.data?.error
        );
      });
  }, []);

  // Handle the skills selection
  const handleApplySkillFilters = (selectedSkills) => {
    setSelectedSkillFilters(selectedSkills);
    if (selectedSkills.length > 0) {
      setSkillSelected(`${selectedSkills.length} skills`);
    } else {
      setSkillSelected("Skills");
    }
  };

  // Handle the project name in the search bar
  const handdlyApplyNameProject = (nameProject) => {
    if (nameProject !== "") {
      setFilterOptions((prev) => ({ ...prev, projectName: nameProject }));
      setFilterOptionsMyProjects((prev) => ({
        ...prev,
        projectName: nameProject,
      }));
    } else {
      const { projectName, ...rest } = filterOptions;
      const { projectName: myProjectName, ...restMyProjects } =
        filterOptionsMyProjects;
      setFilterOptions(rest);
      setFilterOptionsMyProjects(restMyProjects);
    }
  };
  // Handle the client selection
  const handleApplyClientFilters = (clientName, selectedClientId) => {
    if (clientName && selectedClientId) {
      setClientNameSelected(clientName);
      setClientId(selectedClientId);
      setFilterOptions((prev) => ({ ...prev, idcliente: selectedClientId }));
      setFilterOptionsMyProjects((prev) => ({
        ...prev,
        idcliente: selectedClientId,
      }));
    } else {
      setClientNameSelected("Clients");
      setClientId(null);
      const { idcliente, ...rest } = filterOptions;
      const { idcliente: myClientId, ...restMyProjects } =
        filterOptionsMyProjects;
      setFilterOptions(rest);
      setFilterOptionsMyProjects(restMyProjects);
    }
  };

  // Handle the role selection
  const handleApplyRoleFilters = (roleName, selectedRoleId) => {
    if (roleName && selectedRoleId) {
      setRoleNameSelected(roleName);
      setRoleId(selectedRoleId);
      setFilterOptions((prev) => ({ ...prev, nombrerol: roleName }));
    } else {
      setRoleNameSelected("Roles");
      setRoleId(null);
      const { nombrerol, ...rest } = filterOptions;
      setFilterOptions(rest);
    }
  };

  // Remove specific skill filter
  const removeSkillFilter = (skillToRemove) => {
    const newSkills = selectedSkillFilters.filter(
      (skill) => skill !== skillToRemove
    );
    setSelectedSkillFilters(newSkills);
    setSkillSelected(
      newSkills.length > 0 ? `${newSkills.length} skills` : "Skills"
    );
  };

  // Remove client selection
  const removeClientFilter = () => {
    handleApplyClientFilters();
  };
  // Remove role selection
  const removeRoleFilter = () => {
    handleApplyRoleFilters();
  };
  // Clear all skill filters
  const clearAllSkillFilters = () => {
    setSelectedSkillFilters([]);
  };

  // Sort projects based on selected option
  const sortProjects = (projects, option, activeTab) => {
    if (!Array.isArray(projects)) return [];
    const sorted = [...projects];
    switch (option) {
      case "name_asc":
        // Sort by name ascending
        if (activeTab !== "My Projects") {
          // Use the role name when is not in "My Projects" tab
          return sorted.sort((a, b) => a.nombrerol.localeCompare(b.nombrerol));
        } else {
          // Use the project name when in "My Projects" tab
          return sorted.sort((a, b) => a.pnombre.localeCompare(b.pnombre));
        }
      case "name_desc":
        // Sort by name descending
        if (activeTab !== "My Projects") {
          // Use the role name when is not in "My Projects" tab
          return sorted.sort((a, b) => b.nombrerol.localeCompare(a.nombrerol));
        } else {
          // Use the project name when in "My Projects" tab
          return sorted.sort((a, b) => b.pnombre.localeCompare(a.pnombre));
        }
      case "date_desc":
        // Sort by convenience descending the id of the project is created
        return sorted.sort((a, b) => b.idproyecto - a.idproyecto);
      case "date_asc":
        // Sort by convenience ascending the id of the project is created
        return sorted.sort((a, b) => a.idproyecto - b.idproyecto);
      case "compatibility":
        if (activeTab !== "My Projects") {
          // Sort by compatibility descending only if not in "My Projects" tab
          return sorted.sort((a, b) => b.compability - a.compability);
        } else {
          // Just in case of "My Projects" tab, return the same without sorting
          return sorted;
        }
      default:
        return sorted;
    }
  };
  // Flatten projects for list display
  const flattenProjectsForList = (projects) => {
    return projects
      .flatMap((project) => {
        // When the tab is "My Projects", we need to flatten the roles
        if (project.proyecto_roles) {
          return project.proyecto_roles?.map((proyecto_rol) => ({
            project,
            proyecto_rol,
            hasSelectedSkills:
              selectedSkillFilters.length === 0 ||
              proyecto_rol.roles.requerimientos_roles.some((req_rol) =>
                selectedSkillFilters.includes(
                  req_rol.requerimientos.habilidades.nombre
                )
              ),
          }));
        } else {
          const hasSelectedSkills =
            selectedSkillFilters.length === 0 ||
            project.requerimientos_roles.some((req_rol) =>
              selectedSkillFilters.includes(
                req_rol.requerimientos.habilidades.nombre
              )
            );

          // For other tabs, we just return the project
          return {
            project,
            proyecto_rol: null,
            hasSelectedSkills: hasSelectedSkills,
          };
        }
      })
      .filter((item) => item.hasSelectedSkills);
  };

  return {
    projects: Array.isArray(projectsData) ? projectsData : [],
    clients: Array.isArray(clientsData) ? clientsData : [],
    errorClients: errorClients,
    roles: Array.isArray(rolesData) ? rolesData : [],
    errorRoles: errorRoles,
    top: Array.isArray(topData) ? topData : [],
    errorTopProjects: errorTopProjects,
    projectsApp: Array.isArray(myApplicationsData) ? myApplicationsData : [],
    allErrorProjectsDashboard,
    setAllErrorProjectsDashboard,
    searchTerm,
    setSearchTerm,
    selectedSkillFilters,
    userSkills,
    handleApplySkillFilters,
    clientNameSelected,
    clientId,
    handleApplyClientFilters,
    roleNameSelected,
    roleId,
    handleApplyRoleFilters,
    removeSkillFilter,
    removeClientFilter,
    removeRoleFilter,
    clearAllSkillFilters,
    sortProjects,
    flattenProjectsForList,
    skillSelected,
    handdlyApplyNameProject,
    filterOptions,
    setFilterOptions,
    filterOptionsMyProjects,
    setFilterOptionsMyProjects,
    projectsLoading,
    applyLoading,
  };
};

export default useDashboardData;
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const useDashboardData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromURL = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  const [skillSelected, setSkillSelected] = useState("Skills");
  const [selectedSkillFilters, setSelectedSkillFilters] = useState([]);
  const [clientNameSelected, setClientNameSelected] = useState("Clients");
  const [clientId, setClientId] = useState(null);
  const [roleNameSelected, setRoleNameSelected] = useState("Roles");
  const [roleId, setRoleId] = useState(null);

  const [filterOptions, setFilterOptions] = useState({
    idCompatible: localStorage.getItem("id"),
  });

  const [filterOptionsMyProjects, setFilterOptionsMyProjects] = useState({
    idCompatible: localStorage.getItem("id"),
    idusuario: localStorage.getItem("id"),
  });

  const [userSkills, setUserSkills] = useState([]);
  const currentUserId = 1;

  const [projectsData, setProjectsData] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [clientsData, setClientsData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [topData, setTopData] = useState([]);
  const [myApplicationsData, setMyApplicationsData] = useState([]);

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

  let url = "https://pathexplorer-backend.onrender.com/api";
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: filterOptions, // 👈 correct way to send query parameters
  };
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const { data } = await axios.get(`${url}/projects`, config);
        setProjectsData(data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [filterOptions]);

  // Fetch Roles, clients, top projects, my applications and my skills
  useEffect(() => {
    // Fetch Roles
    axios
      .get(`${url}/roles`, config)
      .then((res) => setRolesData(res.data))
      .catch((err) => console.error("Error fetching roles", err));
    // Get user top 3 projects compability
    const userId = localStorage.getItem("id");
    if (userId) {
      axios
        .get(`${url}/projects/top/${userId}`, config)
        .then((res) => setTopData(res.data))
        .catch((err) => console.error("Error fetching top projects", err));
    }
    // Fetch clients
    axios
      .get(`${url}/clientes`, config)
      .then((res) => setClientsData(res.data))
      .catch((err) => console.error("Error fetching clients", err));
    // Fetch user applications
    axios
      .get(`${url}/apps/usuario/${localStorage.getItem("id")}`, config)
      .then((res) => setMyApplicationsData(res.data))
      .catch((err) => console.error("Error fetching my applications", err));

    // Fetch user skills
    axios
      .get(`${url}/habilidades/usuario/${localStorage.getItem("id")}`, config)
      .then((res) => {
        setUserSkills(res.data.data);
      })
      .catch((err) => console.error("Error fetching user skills", err));
  }, []);

  const handleApplySkillFilters = (selectedSkills) => {
    setSelectedSkillFilters(selectedSkills);
    setSkillSelected(
      selectedSkills.length > 0 ? `${selectedSkills.length} skills` : "Skills"
    );
  };
  console.log(myApplicationsData);
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

  const removeSkillFilter = (skillToRemove) => {
    handleApplySkillFilters(
      selectedSkillFilters.filter((skill) => skill !== skillToRemove)
    );
  };

  const removeClientFilter = () => {
    handleApplyClientFilters("Clients", null);
  };

  const removeRoleFilter = () => {
    handleApplyRoleFilters("Roles", null);
  };

  const clearAllSkillFilters = () => {
    handleApplySkillFilters([]);
  };

  const sortProjects = (projects, option) => {
    if (!Array.isArray(projects)) return [];
    const sorted = [...projects];
    switch (option) {
      case "name_asc":
        return sorted.sort((a, b) => a.pnombre.localeCompare(b.pnombre));
      case "name_desc":
        return sorted.sort((a, b) => b.pnombre.localeCompare(a.pnombre));
      case "date_desc":
        return sorted.sort((a, b) => b.idproyecto - a.idproyecto);
      case "date_asc":
        return sorted.sort((a, b) => a.idproyecto - b.idproyecto);
      default:
        return sorted;
    }
  };

  const flattenProjectsForList = (projects) => {
    console.log("flattenProjectsForList", projects);
    return projects
      .flatMap((project) =>
        project.proyecto_roles.map((proyecto_rol) => ({
          project,
          proyecto_rol,
          hasSelectedSkills:
            selectedSkillFilters.length === 0 ||
            proyecto_rol.roles.requerimientos_roles.some((req_rol) =>
              selectedSkillFilters.includes(
                req_rol.requerimientos.habilidades.nombre
              )
            ),
        }))
      )
      .filter((item) => item.hasSelectedSkills);
  };
  console.log("projectsData", projectsData);
  return {
    projects: Array.isArray(projectsData) ? projectsData : [],
    clients: Array.isArray(clientsData) ? clientsData : [],
    roles: Array.isArray(rolesData) ? rolesData : [],
    top: Array.isArray(topData) ? topData : [],
    projectsApp: Array.isArray(myApplicationsData) ? myApplicationsData : [],
    searchTerm,
    setSearchTerm,
    selectedSkillFilters,
    userSkills,
    currentUserId,
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
  };
};

export default useDashboardData;

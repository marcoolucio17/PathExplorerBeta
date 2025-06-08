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
  const [applyLoading, setApplyLoading] = useState(true);
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
    params: filterOptions,
  };
  
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        console.log("fetching all projects with config:", config);
        const { data } = await axios.get(`${url}/projects`, config);
        console.log("all projects fetched:", data);
        console.log("all projects count:", data?.length);
        console.log("sample project structure:", data?.[0]);
        setProjectsData(data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [filterOptions]);

  //fetch roles, clients, top projects, my applications and my skills
  useEffect(() => {
    //fetch roles
    axios
      .get(`${url}/roles`, config)
      .then((res) => setRolesData(res.data))
      .catch((err) => console.error("Error fetching roles", err));
    
    //get user top 3 projects compability
    const userId = localStorage.getItem("id");
    if (userId) {
      axios
        .get(`${url}/projects/top/${userId}`, config)
        .then((res) => setTopData(res.data))
        .catch((err) => console.error("Error fetching top projects", err));
    }
    
    //fetch clients
    axios
      .get(`${url}/clientes`, config)
      .then((res) => setClientsData(res.data))
      .catch((err) => console.error("Error fetching clients", err));
    
    //fetch user applications
    console.log("fetching user applications for user:", localStorage.getItem("id"));
    console.log("dashboard data: --------------------------------------------------", projectsData);
    axios
      .get(`${url}/apps/usuario/${localStorage.getItem("id")}`, config)
      .then((res) => {
        console.log("applications data fetched:", res.data);
        console.log("applications count:", res.data?.length);
        console.log("sample application structure:", res.data?.[0]);
        setMyApplicationsData(res.data);
        setApplyLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching my applications", err);
        setApplyLoading(false);
      });

    //fetch user skills
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
    const timestamp = Date.now();
    console.log(`[${timestamp}] flattenProjectsForList called with projects:`, projects);
    
    const finalResult = projects
      .flatMap((project) => {
        //defensive check for proyecto_roles
        if (!project.proyecto_roles || !Array.isArray(project.proyecto_roles)) {
          console.log(`[${timestamp}] project has no proyecto_roles:`, project.pnombre);
          return [];
        }
        
        console.log(`[${timestamp}] processing project ${project.pnombre} with ${project.proyecto_roles.length} roles`);
        
        const filteredRoles = project.proyecto_roles
          .filter((proyecto_rol) => {
            //ensure we have complete data before filtering
            if (!proyecto_rol.roles || proyecto_rol.roles.disponible === undefined) {
              console.log(`[${timestamp}] role ${proyecto_rol.roles?.nombrerol || 'unknown'} has no disponible property: FILTERED OUT (incomplete data)`);
              return false; //filter out incomplete data
            }
            const shouldInclude = proyecto_rol.roles.disponible === true;
            console.log(`[${timestamp}] role ${proyecto_rol.roles?.nombrerol || 'unknown'} with disponible ${proyecto_rol.roles.disponible}: ${shouldInclude ? 'INCLUDED' : 'FILTERED OUT'}`);
            return shouldInclude;
          });
          
        console.log(`[${timestamp}] after filtering: ${filteredRoles.length} roles remaining for ${project.pnombre}`);
        
        return filteredRoles.map((proyecto_rol) => ({
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
      })
      .filter((item) => item.hasSelectedSkills);
      
    console.log(`[${timestamp}] flattenProjectsForList final result:`, finalResult);
    console.log(`[${timestamp}] flattenProjectsForList final result length:`, finalResult.length);
    
    return finalResult;
  };
  
  console.log("projectsData", myApplicationsData);
  
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
    applyLoading,
  };
};

export default useDashboardData;
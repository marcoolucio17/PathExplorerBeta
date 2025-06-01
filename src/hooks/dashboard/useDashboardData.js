import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useDataFetching from "../useDataFetching";
import useListPage from "../useListPage";
import useModalControl from "../useModalControl";
import useGetFetch from "../useGetFetch";
/**
 *
 *
 * @returns {Object} Dashboard data and related functions
 */
export const useDashboardData = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //search param from URL
  const searchParams = new URLSearchParams(location.search);
  const searchFromURL = searchParams.get("search") || "";

  //searchand filter state
  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  const [skillSelected, setSkillSelected] = useState("Skills");
  const [selectedSkillFilters, setSelectedSkillFilters] = useState([]);
  //Selected the name of the client
  const [clientNameSelected, setClientNameSelected] = useState("Clients");
  //Selected the id client
  const [clientId, setClientId] = useState(null);
  //Name of the selected role
  const [roleNameSelected, setRoleNameSelected] = useState("Roles");
  //Selected the id role
  const [roleId, setRoleId] = useState(null);

  const [userSkills, setUserSkills] = useState(["C#", "React", "Node.js"]); // Example user skills

  //mock current user ID (this would come from authentication context in real app)
  const currentUserId = 1;

  //URL management for search
  /*useEffect(() => {
    if (searchTerm) {
      const params = new URLSearchParams(location.search);
      params.set("search", searchTerm);
      handdlyApplyNameProject(searchTerm); // Apply project name filter
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else if (searchFromURL) {
      // If search term is cleared, remove it from URL
      const params = new URLSearchParams(location.search);
      params.delete("search");
      handdlyApplyNameProject(); // Clear project name filter
      navigate(
        `${location.pathname}${
          params.toString() ? `?${params.toString()}` : ""
        }`,
        { replace: true }
      );
    }
  }, [searchTerm, navigate, location.pathname, location.search, searchFromURL]);

  // Update search term when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);
*/
  //fetch data
  const { data: projectsData } = useGetFetch({ rutaApi: "projects" });

  const { data: clientsData } = useGetFetch({ rutaApi: "clientes" });

  //const { data: skillsData } = useGetFetch({ rutaApi: 'habilidades' });

  const { data: rolesData } = useGetFetch({ rutaApi: "roles" });

  //apply skills filters
  const handleApplySkillFilters = (selectedSkills) => {
    setSelectedSkillFilters(selectedSkills);

    //update the Skills button text based on selected skills
    if (selectedSkills.length > 0) {
      setSkillSelected(`${selectedSkills.length} skills`);
    } else {
      setSkillSelected("Skills");
    }
  };

  //Apply client filters
  const handleApplyClientFilters = (clientName, clientId) => {
    //update the Client button text based on selected clients
    if (clientName && clientId) {
      setClientNameSelected(clientName);
      setClientId(clientId);
    } else {
      setClientNameSelected("Clients");
      setClientId(null);
    }
  };

  //Apply role filters
  const handleApplyRoleFilters = (roleName, roleId) => {
    //update the Role button text based on selected roles
    if (roleName && roleId) {
      setRoleNameSelected(roleName);
      setRoleId(roleId);
    } else {
      setRoleNameSelected("Roles");
      setRoleId(null);
    }
  };
  //Apply project name as filter
  const handdlyApplyNameProject = (nameProject) => {
    if (nameProject !== "") {
      setFilterOptions({
        ...filterOptions,
        projectName: nameProject, // Update filter options with project name
      });
    } else {
      const { projectName, ...rest } = filterOptions; // Remove project name filter
      setFilterOptions(rest);
    }
  };
  //Apply client filters
  const handleApplyClientFilters = (clientName, clientId) => {
    //update the Client button text based on selected clients
    if (clientName && clientId) {
      setClientNameSelected(clientName);
      setFilterOptions({
        ...filterOptions,
        idcliente: clientId, // Update filter options with selected client ID
      });
      setClientId(clientId);
    } else {
      setClientNameSelected("Clients");
      const { idcliente, ...rest } = filterOptions; // Remove client filter
      setFilterOptions(rest);
      setClientId(null);
    }
  };

  //Apply role filters
  const handleApplyRoleFilters = (roleName, roleId) => {
    //update the Role button text based on selected roles
    if (roleName && roleId) {
      setRoleNameSelected(roleName);
      setRoleId(roleId);
      setFilterOptions({
        ...filterOptions,
        nombrerol: roleName, // Update filter options with selected role ID
      });
    } else {
      setRoleNameSelected("Roles");
      setRoleId(null);
      const { nombrerol, ...rest } = filterOptions; // Remove role filter
      setFilterOptions(rest);
    }
  };

  // Remove a specific skill filter
  const removeSkillFilter = (skillToRemove) => {
    const updatedSkills = selectedSkillFilters.filter(
      (skill) => skill !== skillToRemove
    );
    handleApplySkillFilters(updatedSkills);
  };

  // Remove the client filter
  const removeClientFilter = () => {
    handleApplyClientFilters("Clients", null);
  };

  // Remove the role filter
  const removeRoleFilter = () => {
    handleApplyRoleFilters("Roles", null);
  };

  // Clear all skill filters
  const clearAllSkillFilters = () => {
    handleApplySkillFilters([]);
  };

  // Sort projects function
  const sortProjects = (projects, option) => {
    if (!Array.isArray(projects)) return [];
    const sorted = [...projects];

    switch (option) {
      case "name_asc": // Name: A to Z
        return sorted.sort((a, b) => a.pnombre.localeCompare(b.pnombre));

      case "name_desc": // Name: Z to A
        return sorted.sort((a, b) => b.pnombre.localeCompare(a.pnombre));

      case "date_desc": // Newest First
        return sorted.sort((a, b) => b.idproyecto - a.idproyecto);

      case "date_asc": // Oldest First
        return sorted.sort((a, b) => a.idproyecto - b.idproyecto);

      case "match_desc": // Compatibility: High to Low
        return sorted.sort((a, b) => {
          const matchA = calculateMatchPercentage(a);
          const matchB = calculateMatchPercentage(b);
          return matchB - matchA;
        });

      case "match_asc": // Compatibility: Low to High
        return sorted.sort((a, b) => {
          const matchA = calculateMatchPercentage(a);
          const matchB = calculateMatchPercentage(b);
          return matchA - matchB;
        });

      default:
        return sorted;
    }
  };

  // Flatten the projects to map each role to a project for the ProjectList component
  const flattenProjectsForList = (projects) => {
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

  return {
    projects: Array.isArray(projectsData) ? projectsData : [],
    clients: Array.isArray(clientsData) ? clientsData : [],
    //skills: Array.isArray(skillsData) ? skillsData : [],
    roles: Array.isArray(rolesData) ? rolesData : [],
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
    clearAllSkillFilters,
    sortProjects,
    flattenProjectsForList,
  };
};

export default useDashboardData;

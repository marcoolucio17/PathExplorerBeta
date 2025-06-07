import { useState, useEffect, useMemo } from "react";

/**
 * Custom hook for managing multiple filters (skills, projects, search, roles)
 * @param {Array} data - The data array to filter
 * @param {Object} options - Filter options and configuration
 * @returns {Object} - Filter state and filtered data
 */
const useFilters = (data = [], options = {}) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const {
    searchTerm = "",
    skillsField = "skills",
    projectField = "project",
    roleField = "tipo",
    nameField = "nombre",
    emailField = "correoelectronico",
  } = options;

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  // Filtering logic for roles
  const filterByRoles = useMemo(() => {
    if (selectedRoles.length === 0) return safeData;

    console.log('Filtering by roles:', selectedRoles);
    console.log('Sample user data:', safeData[0]);
    
    const filtered = safeData.filter((item) => {
      if (!item || !item[roleField]) {
        console.log('Item missing role field:', item);
        return false;
      }
      
      const itemRole = item[roleField];
      const matchesRole = selectedRoles.includes(itemRole);
      
      if (selectedRoles.length > 0) {
        console.log(`Checking ${item[nameField]} with role "${itemRole}" against [${selectedRoles.join(', ')}] = ${matchesRole}`);
      }
      
      return matchesRole;
    });
    
    console.log('Filtered by roles result:', filtered.length, 'out of', safeData.length);
    return filtered;
  }, [safeData, selectedRoles, roleField, nameField]);

  // Filtering logic for skills
  const filterBySkills = useMemo(() => {
    if (selectedSkills.length === 0) return filterByRoles;

    return filterByRoles.filter((item) => {
      if (!item || !item[skillsField] || !Array.isArray(item[skillsField])) {
        return false;
      }

      const itemSkills = item[skillsField]
        .map((skill) => {
          if (typeof skill === "string") return skill.toLowerCase();
          if (skill && skill.nombre) return skill.nombre.toLowerCase();
          return "";
        })
        .filter(Boolean);

      return selectedSkills.some(
        (skill) => skill && itemSkills.includes(skill.toLowerCase())
      );
    });
  }, [filterByRoles, selectedSkills, skillsField]);

  // Filtering logic for project
  const filterByProject = useMemo(() => {
    if (!selectedProject || selectedProject === "All Projects")
      return filterBySkills;

    const lowerProject = selectedProject.toLowerCase();

    return filterBySkills.filter((item) => {
      if (!item) return false;

      // Check direct project field
      if (
        item[projectField] &&
        typeof item[projectField] === "string" &&
        item[projectField].toLowerCase() === lowerProject
      ) {
        return true;
      }

      // Check in applications if available
      if (item.applications && Array.isArray(item.applications)) {
        return item.applications.some((app) => {
          if (!app) return false;

          if (
            app.proyecto &&
            typeof app.proyecto === "string" &&
            app.proyecto.toLowerCase() === lowerProject
          ) {
            return true;
          }

          if (
            app.proyecto &&
            app.proyecto.pnombre &&
            typeof app.proyecto.pnombre === "string" &&
            app.proyecto.pnombre.toLowerCase() === lowerProject
          ) {
            return true;
          }

          return false;
        });
      }

      return false;
    });
  }, [filterBySkills, selectedProject, projectField]);

  // Filtering logic for search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return filterByProject;

    const lowerSearchTerm = searchTerm.toLowerCase();
    console.log('Searching for:', lowerSearchTerm);
    console.log('Sample item for search:', filterByProject[0]);

    const searchResults = filterByProject.filter((item) => {
      if (!item) return false;

      let found = false;
      let matchField = '';

      // Check all possible name fields
      const possibleNameFields = [nameField, 'nombre', 'name', 'fullName', 'displayName'];
      for (const field of possibleNameFields) {
        if (item[field] && typeof item[field] === "string" && item[field].toLowerCase().includes(lowerSearchTerm)) {
          found = true;
          matchField = field;
          break;
        }
      }

      // Check all possible email fields
      if (!found) {
        const possibleEmailFields = [emailField, 'correoelectronico', 'email', 'emailAddress'];
        for (const field of possibleEmailFields) {
          if (item[field] && typeof item[field] === "string" && item[field].toLowerCase().includes(lowerSearchTerm)) {
            found = true;
            matchField = field;
            break;
          }
        }
      }

      if (found) {
        console.log(`Found match in ${matchField}: "${item[matchField]}" for search "${lowerSearchTerm}"`);
      }

      return found;
    });
    
    console.log('Search results:', searchResults.length, 'out of', filterByProject.length);
    return searchResults;
  }, [filterByProject, searchTerm, nameField, emailField]);

  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedProject("All Projects");
    setSelectedRoles([]);
  };

  return {
    selectedSkills,
    setSelectedSkills,
    selectedProject,
    setSelectedProject,
    selectedRoles,
    setSelectedRoles,
    filteredData,
    resetFilters,
  };
};

export default useFilters;
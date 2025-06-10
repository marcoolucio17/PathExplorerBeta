import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useModalControl from '../useModalControl';
import { useFetch } from 'src/hooks/useFetch';


function isNonTechnicalSkill(skillName) {
  const nonTechnicalSkills = [
    "responsabilidad",
    "comunicación",
    "liderazgo",
    "teamwork",
    "leadership",
    "communication",
    "responsibility",
    "agile",
    "scrum",
    "project management",
    "time management",
  ];
  return nonTechnicalSkills.some((skill) =>
    skillName.toLowerCase().includes(skill.toLowerCase())
  );
}

function transformBackendProject(projectData, roleId = null) {
  if (!projectData) {
    console.log("projectData is not being sent or has nothing");
    return null;
  }

  let project;
  if (Array.isArray(projectData)) {
    if (projectData.length === 0) {
      return null;
    }
    project = projectData[0];
  } else {
    project = projectData;
  }

  const requiredSkills = [];
  const availableRoles = [];
  let primaryRole = null;

  const isSpecificRole =
    roleId && project.proyecto_roles?.find((r) => r.idrol == roleId);

  if (project.proyecto_roles && Array.isArray(project.proyecto_roles)) {
    project.proyecto_roles.forEach((proyectoRole, index) => {
      const roleObj = {
        id: proyectoRole.idrol,
        name: proyectoRole.roles?.nombrerol || `Role ${proyectoRole.idrol}`,
        level: proyectoRole.roles?.nivelrol || "",
        description: proyectoRole.roles?.descripcionrol || "",
        available: proyectoRole.estado === "Pendiente",
      };

      if (isSpecificRole && proyectoRole.idrol == roleId) {
        primaryRole = roleObj;
      } else if (!isSpecificRole && index === 0) {
        primaryRole = roleObj;
      }

      //only add roles that are available (estado: "pendiente")
      if (proyectoRole.estado === "Pendiente") {
        availableRoles.push(roleObj);
      }
    });
  } else if (project.roles) {
    if (Array.isArray(project.roles)) {
      project.roles.forEach((role, index) => {
        const roleObj = {
          id: role.idrol,
          name: role.nombrerol,
          level: role.nivelrol || "",
          description: role.descripcionrol || "",
          available: role.estado === "Pendiente",
        };

        if (index === 0) {
          primaryRole = roleObj;
        }

        //only add roles that are available (estado: "pendiente")
        if (role.estado === "Pendiente") {
          availableRoles.push(roleObj);
        }
      });
    } else if (project.roles.nombrerol && project.roles.idrol) {
      const roleObj = {
        id: project.roles.idrol,
        name: project.roles.nombrerol,
        level: "",
        available: true,
      };

      primaryRole = roleObj;
      availableRoles.push(roleObj);
    }
  }

  //transform skills array from the specific role or all roles
  if (project.proyecto_roles && Array.isArray(project.proyecto_roles)) {
    //if we have a specific role, get skills from that role only
    if (isSpecificRole) {
      const specificRole = project.proyecto_roles.find(
        (r) => r.idrol == roleId
      );
      if (specificRole?.roles?.requerimientos_roles) {
        specificRole.roles.requerimientos_roles.forEach((reqRole) => {
          if (reqRole.requerimientos?.habilidades) {
            requiredSkills.push({
              name: reqRole.requerimientos.habilidades.nombre,
              isUserSkill: false,
              isTechnical: reqRole.requerimientos.habilidades.estecnica,
              roleId: specificRole.idrol,
              experienceTime: reqRole.requerimientos.tiempoexperiencia,
            });
          }
        });
      }
    } else {
      //get skills from all roles
      project.proyecto_roles.forEach((proyectoRole) => {
        if (proyectoRole.roles?.requerimientos_roles) {
          proyectoRole.roles.requerimientos_roles.forEach((reqRole) => {
            if (reqRole.requerimientos?.habilidades) {
              requiredSkills.push({
                name: reqRole.requerimientos.habilidades.nombre,
                isUserSkill: false,
                isTechnical: reqRole.requerimientos.habilidades.estecnica,
                roleId: proyectoRole.idrol,
                experienceTime: reqRole.requerimientos.tiempoexperiencia,
              });
            }
          });
        }
      });
    }
  }

  //fallback skills if no skills found
  if (requiredSkills.length === 0) {
    const fallbackSkills = ["JavaScript", "React", "Node.js", "SQL", "Git"];
    fallbackSkills.forEach((skillName) => {
      requiredSkills.push({
        name: skillName,
        isUserSkill: false,
        isTechnical: !isNonTechnicalSkill(skillName),
        roleId: null,
        experienceTime: null,
      });
    });
  }

  //create people array (client + project manager) separate from team members
  const people = [];

  //add project creator/manager to people
  if (project.usuario) {
    people.push({
      id: project.usuario.idusuario,
      name: project.usuario.nombre || "Project Manager",
      avatar: project.usuario.fotodeperfil_url || "/img/fotogabo.jpg",
      role: "Project Manager",
    });
  }

  //transform team members array from utp field (excluding project manager)
  const members = [];

  //add team members from utp field (excluding the project manager)
  if (project.utp && Array.isArray(project.utp)) {
    project.utp.forEach((utpEntry, index) => {
      //check if utpEntry has user info and is not the project manager
      if (
        utpEntry.usuario &&
        utpEntry.usuario.idusuario !== project.idusuario
      ) {
        members.push({
          id: utpEntry.usuario.idusuario || index + 100,
          name: utpEntry.usuario.nombre || `Member ${index + 1}`,
          avatar: utpEntry.usuario.fotodeperfil_url || "/img/fotogabo.jpg",
          role: utpEntry.rol?.nombrerol || "Team Member",
        });
      }
    });
  }

  return {
    id: project.idproyecto,
    title: project.pnombre,
    description: project.descripcion,
    startDate: formatDate(project.fechainicio),
    estimatedFinishDate: formatDate(project.fechafin),
    progress: calculateProgress(project.fechainicio, project.fechafin),
    goal: project.descripcion || "Project goal not specified",
    deliverables: project.projectdeliverables
      ? project.projectdeliverables.split(",").map((d) => d.trim())
      : extractDeliverables(project.descripcion),
    client: {
      name: project.cliente?.clnombre || "Unknown Client",
      logo: project.cliente?.fotodecliente_url || "/img/pepsi-logo.png",
      investment: project.cliente?.inversion || 0,
    },
    primaryRole: primaryRole,
    people: people, //client + project manager
    members: members, //team members only
    requiredSkills: removeDuplicateSkills(requiredSkills),
    availableRoles: availableRoles,
    //rfp document info
    rfpfile: project.rfpfile,
    rfpfile_url: project.rfpfile_url,
  };
}

//format date for viewing
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
}
//calculate progress
function calculateProgress(startDate, endDate) {
  if (!startDate || !endDate) return 0; //default value

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end.getTime() - start.getTime();
  if (total <= 0) return 100;
  const elapsed = now.getTime() - start.getTime();

  return Math.round((elapsed / total) * 100);
}

function extractDeliverables(description) {
  if (!description)
    return [
      "Project documentation",
      "Development deliverables",
      "Testing and validation",
      "Final deployment",
    ];

  return [
    "Android & iOS mobile app",
    "Backend to manage user data & posts",
    "Secure database",
    "Admin web portal",
  ];
}

//remove duplicate skills
function removeDuplicateSkills(skills) {
  const seen = new Set();
  return skills.filter((skill) => {
    const skillName = skill.name;
    if (seen.has(skillName)) {
      return false;
    }
    seen.add(skillName);
    return true;
  });
}

//check if user has specific skills
function checkUserSkills(requiredSkills, userSkills) {
  const userSkillsSet = new Set(userSkills);
  return requiredSkills.map((skill) => ({
    ...skill,
    isUserSkill: userSkillsSet.has(skill.name),
  }));
}

//custom hook for empleadoproyectopage
const useEmpleadoProyectoPage = () => {
  const { projectId: urlProjectId, roleId: urlRoleId } = useParams();
  const navigate = useNavigate();

  //get ids from url params or fallback to localStorage
  const projectId = urlProjectId || localStorage.getItem("projectid");
  const roleId = urlRoleId || localStorage.getItem("idrol");

  //always use /completo to get all project data (better than por-rol)
  const { data, error, loading } = useFetch(`${projectId || "87"}/completo`);

  // Modal control
  const { modals, openModal, closeModal } = useModalControl([
    "skills",
    "compatibility",
    "application",
    "allSkills",
    "rfp",
  ]);

  // Refs
  const peopleSectionRef = useRef(null);

  //get actual user ID from localStorage
  const userId =
    localStorage.getItem("user_id") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("id") ||
    "1";

  //check if user has already applied to this project
  const { data: userApplications, loading: applicationsLoading } = useFetch(
    `apps/usuario/${userId}`
  );

  //transform backend data to frontend format
  const projectData = useMemo(() => {
    const transformed = transformBackendProject(data, roleId);

    return transformed;
  }, [data, roleId, projectId]);

  //user skills for compatibility calculation temp only
  const [userSkills] = useState(["Python", "C#", "Figma"]);

  //update required skills with user skill status
  const enhancedProjectData = useMemo(() => {
    if (!projectData) return null;

    return {
      ...projectData,
      requiredSkills: checkUserSkills(projectData.requiredSkills, userSkills),
    };
  }, [projectData, userSkills]);

  //check if user has applied to current project (must be after enhancedProjectData)
  const hasAppliedToProject = useMemo(() => {
    if (
      !userApplications ||
      !Array.isArray(userApplications) ||
      !enhancedProjectData?.availableRoles
    ) {
      return false;
    }

    //get all role IDs from current project
    const projectRoleIds = enhancedProjectData.availableRoles.map(
      (role) => role.id
    );

    //check if user has applied to any role in this project
    const hasApplied = userApplications.some((application) =>
      projectRoleIds.includes(application.idrol)
    );

    return hasApplied;
  }, [userApplications, enhancedProjectData?.availableRoles]);

  //actions
  const handleShowApplication = useCallback(() => {
    openModal("application");
  }, [openModal]);

  const handleSubmitApplication = useCallback(async (applicationData) => {
    console.log("Application submitted:", applicationData);
    //refresh applications after successful submission
    //note: in a real app you might want to invalidate the cache or refetch
  }, []);

  const handleShowCompatibility = useCallback(() => {
    openModal("compatibility");
  }, [openModal]);

  const handleShowSkills = useCallback(() => {
    openModal("skills");
  }, [openModal]);

  const handleShowAllSkills = useCallback(() => {
    openModal("allSkills");
  }, [openModal]);

  const handleShowRFP = useCallback(() => {
    openModal("rfp");
  }, [openModal]);

  const handleMemberSelect = useCallback((member) => {
    console.log("Selected member:", member);
  }, []);

  const handleRoleSelect = useCallback(
    (roleItem) => {
      const roleId = roleItem.roleId;
      if (roleId) {
        navigate(`/empleado/proyecto/${projectId}/${roleId}`);
      }
    },
    [navigate, projectId]
  );

  //calculate compatibility percentage
  const calculateCompatibilityPercentage = useCallback(() => {
    if (
      !enhancedProjectData?.requiredSkills ||
      enhancedProjectData.requiredSkills.length === 0
    ) {
      return 0;
    }

    const totalSkills = enhancedProjectData.requiredSkills.length;
    const userSkillsSet = new Set(userSkills);
    const matchingSkills = enhancedProjectData.requiredSkills.filter((skill) =>
      userSkillsSet.has(skill.name)
    ).length;

    return Math.round((matchingSkills / totalSkills) * 100);
  }, [enhancedProjectData?.requiredSkills, userSkills]);

  // update browser tab title with project and role names
  useEffect(() => {
    if (enhancedProjectData?.title && enhancedProjectData?.primaryRole?.name) {
      document.title = `${enhancedProjectData.title} - ${enhancedProjectData.primaryRole.name}`;
    } else {
      document.title = "Project Details";
    }

    return () => {
      document.title = "PathExplorer";
    };
  }, [enhancedProjectData?.title, enhancedProjectData?.primaryRole?.name]);

  return {
    // Data
    projectData: enhancedProjectData,
    userSkills,

    // API state
    loading: loading || applicationsLoading,
    error,

    // State
    isApplied: hasAppliedToProject,
    isLoading: false,

    // Refs
    peopleSectionRef,

    // Modals
    modals,
    openModal,
    closeModal,

    // Actions
    handleShowApplication,
    handleSubmitApplication,
    handleShowCompatibility,
    handleShowSkills,
    handleShowAllSkills,
    handleShowRFP,
    handleMemberSelect,
    handleRoleSelect,
    calculateCompatibilityPercentage,
  };
};

export default useEmpleadoProyectoPage;
import { useState, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useModalControl from '../useModalControl';
import { useFetch } from 'src/hooks/useFetch';
import useProjectApplication from './useProjectApplication';


function isNonTechnicalSkill(skillName) {
  const nonTechnicalSkills = [
    'responsabilidad', 'comunicación', 'liderazgo', 'teamwork', 
    'leadership', 'communication', 'responsibility', 'agile',
    'scrum', 'project management', 'time management'
  ];
  return nonTechnicalSkills.some(skill => 
    skillName.toLowerCase().includes(skill.toLowerCase())
  );
}


function transformBackendProject(projectData, roleId = null) {
  
  
  if (!projectData) {
    console.log('projectData is not being sent or has nothing');
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

  const isSpecificRole = roleId && project.proyecto_roles?.find(r => r.idrol == roleId);
  
  if (project.proyecto_roles && Array.isArray(project.proyecto_roles)) {
    project.proyecto_roles.forEach((role, index) => {
      const roleObj = {
        id: role.idrol,
        name: role.nombrerol || `Role ${role.idrol}`,
        level: role.nivelrol || "",
        description: role.descripcionrol || "",
        available: role.estado === "Pendiente",
      };

      if (isSpecificRole && role.idrol == roleId) {
        primaryRole = roleObj;
      } else if (!isSpecificRole && index === 0) {
        primaryRole = roleObj;
      }

      availableRoles.push(roleObj);
    });
  }
  else if (project.roles) {
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

        availableRoles.push(roleObj);
      });
    }
    else if (project.roles.nombrerol && project.roles.idrol) {
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

  //transform skills array 
  if (project.habilidades && Array.isArray(project.habilidades)) {
    project.habilidades.forEach((skillName) => {
      requiredSkills.push({
        name: skillName,
        isUserSkill: false,
        isTechnical: !isNonTechnicalSkill(skillName),
        roleId: null,
        experienceTime: null,
      });
    });
  } else {
    //fallback skills
    const fallbackSkills = ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];
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

  //transform members array
  const members = [];
  if (project.miembros && Array.isArray(project.miembros)) {
    project.miembros.forEach((memberName, index) => {
      members.push({
        id: index + 1,
        name: memberName,
        avatar: '/img/fotogabo.jpg',
        role: availableRoles[0]?.name || 'Team Member',
      });
    });
  } else {
    members.push({
      id: 1,
      name: 'Project Manager',
      avatar: '/img/fotogabo.jpg',
      role: 'Project Manager',
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
      ? project.projectdeliverables.split(',').map((d) => d.trim())
      : extractDeliverables(project.descripcion),
    client: {
      name: project.cliente?.clnombre || "Unknown Client",
      logo: project.cliente?.fotodecliente ? `/img/${project.cliente.fotodecliente}` : "/img/pepsi-logo.png",
      investment: project.cliente?.inversion || 0,
    },
    primaryRole: primaryRole,
    people: [
      {
        id: 1,
        name: project.creador || "Project Creator",
        role: "Project Manager",
        avatar: "/img/fotogabo.jpg",
      },
    ],
    members: members,
    requiredSkills: removeDuplicateSkills(requiredSkills),
    availableRoles: availableRoles,
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
  if (!description) return [
    "Project documentation",
    "Development deliverables",
    "Testing and validation",
    "Final deployment"
  ];

  return [
    "Android & iOS mobile app",
    "Backend to manage user data & posts",
    "Secure database",
    "Admin web portal"
  ];
}

//remove duplicate skills
function removeDuplicateSkills(skills) {
  const seen = new Set();
  return skills.filter(skill => {
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
  return requiredSkills.map(skill => ({
    ...skill,
    isUserSkill: userSkillsSet.has(skill.name)
  }));
}

//Custom hook for EmpleadoProyectoPageManages

const useEmpleadoProyectoPage = () => {

  const { projectId, roleId } = useParams();
  const navigate = useNavigate();

  //always use /completo to get all project data (better than por-rol)
  const { data, error, loading } = useFetch(`${projectId || '87'}/completo`);

  // Modal control
  const { modals, openModal, closeModal } = useModalControl([
    'skills',
    'compatibility',
    'application',
    'allSkills'
  ]);

  // Refs
  const peopleSectionRef = useRef(null);

  //get actual user ID from localStorage (replace 'user_id' with the correct key your app uses)
  const userId = localStorage.getItem('user_id') || localStorage.getItem('userId') || '1'; 
  
  console.log('User Authentication');
  console.log('User ID from localStorage:', userId);
  console.log('Available localStorage keys:', Object.keys(localStorage));

  //transform backend data to frontend format
  const projectData = useMemo(() => {
    const transformed = transformBackendProject(data, roleId);
    console.log('DEBUG: Project Data');
    console.log('Raw dogging backend data:', data);
    console.log('Transformed project data:', transformed);
    console.log('Project ID from params:', projectId);
    console.log('Role ID from params:', roleId);
    console.log('---------------------------------');
    return transformed;
  }, [data, roleId]);

  //user skills for compatibility calculation temp only
  const [userSkills] = useState([
    "JavaScript",
    "Agile", 
    "Figma"
  ]);

  //update required skills with user skill status
  const enhancedProjectData = useMemo(() => {
    if (!projectData) return null;

    return {
      ...projectData,
      requiredSkills: checkUserSkills(projectData.requiredSkills, userSkills)
    };
  }, [projectData, userSkills]);

  //project data
  const {
    submitApplication,
    isLoading: isLoadingApplication,
    error: applicationError,
    isApplied
  } = useProjectApplication(projectId, userId, enhancedProjectData);

  //actions
  const handleShowApplication = useCallback(() => {
    openModal('application');
  };

  const handleSubmitApplication = useCallback(async (applicationData) => {
    try {
      const result = await submitApplication(applicationData);
      
      if (result.success) {
        closeModal('application');
        console.log('Application submitted successfully:', result.data);
      } else {
        console.error('Error submitting application:', result.error);
        
      }
    } catch (err) {
      console.error('Unexpected error submitting application:', err);
    }
  }, [submitApplication, closeModal]); 

  const handleShowCompatibility = () => {
    openModal('compatibility');
  };

  const handleShowSkills = () => {
    openModal('skills');
  };

  const handleShowAllSkills = () => {
    openModal('allSkills');
  };

  const handleMemberSelect = (member) => {
    console.log('Selected member:', member);
  }, []);

  const handleRoleSelect = useCallback((roleItem) => {
    const roleId = roleItem.roleId;
    if (roleId) {
      navigate(`/empleado/proyecto/${projectId}/${roleId}`);
    }
  }, [navigate, projectId]);
  
  //calculate compatibility percentage
  const calculateCompatibilityPercentage = useCallback(() => {
    if (!enhancedProjectData?.requiredSkills || enhancedProjectData.requiredSkills.length === 0) {
      return 0;
    }

    const totalSkills = enhancedProjectData.requiredSkills.length;
    const userSkillsSet = new Set(userSkills); //use the set
    const matchingSkills = enhancedProjectData.requiredSkills.filter(skill =>
      userSkillsSet.has(skill.name)
    ).length;
    
    return totalSkills > 0 ? Math.round((matchingSkills / totalSkills) * 100) : 0;
  };

  return {
    // Data
    projectData,
    userSkills,
    
    // State
    isApplied,
    isLoading: isLoadingApplication, 

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
    handleMemberSelect,
    handleRoleSelect,
    calculateCompatibilityPercentage,
  };
};

export default useEmpleadoProyectoPage;
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useModalControl from "../useModalControl";
import useToggleState from "../useToggleState";

// import api shit
import { useFetch } from "src/hooks/useFetch";

import axios from "axios";

const DB_URL = "https://pathexplorer-backend.onrender.com/";
// const DB_URL = "http://localhost:8080/";

function transformBackendUser(user, projects) {
  // guardo un template de lo que espera la función de carta del empleado
  const newuser = {
    name: "",
    title: "",
    company: "Accenture",
    location: "Monterrey, Nuevo León, Mexico",
    avatarUrl: "/imagesUser/Sammy.png",
    email: "sammy.garcy@accenture.com",
    phone: "+52 81 1234 5678",
    linkedin: "linkedin.com/in/sammygarcy",
    github: "github.com/sammygarcy",
  };

  if (!user) return newuser;

  // https://<tu-url>.supabase.co/storage/v1/object/public/fotos-perfil/foto-123.jpg"
  // https://nxkreheabczqsutrzafn.supabase.co
  let url =
    "https://nxkreheabczqsutrzafn.supabase.co/storage/v1/object/public/fotos-perfil/";

  newuser.name = formatName(user.nombre);
  newuser.pnombre = projects[0].proyecto.pnombre || "Staff";
  newuser.finicio = projects[0].fechainicio || "-";
  newuser.fechafin = projects[0].fechafin || "-";
  newuser.location = user.ubicacion;
  newuser.email = user.correoelectronico;
  newuser.phone = user.telefono;
  newuser.linkedin = user.linkedin;
  newuser.github = user.github;
  newuser.title = projects[0].rol.nombrerol || "Staff";
  newuser.role = user.tipo;
  newuser.avatarUrl =
    "https://nxkreheabczqsutrzafn.supabase.co/storage/v1/object/sign/fotos-perfil/foto-15-1748207570840.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFkNDY3ZWNhLTk2NDgtNGRjYy05YTQyLTJhMzQyNWZmM2VhMCJ9.eyJ1cmwiOiJmb3Rvcy1wZXJmaWwvZm90by0xNS0xNzQ4MjA3NTcwODQwLmpwZyIsImlhdCI6MTc0ODI5MTkyNywiZXhwIjoxNzc5ODI3OTI3fQ.gi_C6RcvsXN_fKFsLZHFZ8cAwQ065_8AjUxnZA-ecIU";

  return newuser;
}

function formatDateToMonthYear(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

function transformBackendExperience(projects) {
  const res = [];

  if (!projects) return res;

  projects.forEach((project) => {
    let temp = {
      id: project.idproyecto,
      dateStart: formatDateToMonthYear(project.fechainicio),
      dateEnd: formatDateToMonthYear(project.fechafin),
      logo: "/imagesUser/trump.png", // no tenemos fotos aún lolls
      alt: project.rol.nombrerol,
      title: project.rol.nombrerol,
      description: project.rol.descripcionrol,
    };

    res.push(temp);
  });

  return res;
}

function transformBackendCertificates(certificates) {
  let res = [];

  if (!certificates) return res;

  certificates.forEach((certificate) => {
    let url = "/imagesUser/JavaScript-logo.png";

    let temp = {
      id: certificate.certificaciones.idcertificaciones,
      img: url,
      title: certificate.certificaciones.cnombre,
      issuer: certificate.certificaciones.emitidopor,
      skill: "Python",
      fechaObtenido: formatDateToMonthYear(
        certificate.certificaciones.fechaobtenido
      ),
      fechaExpirado: formatDateToMonthYear(
        certificate.certificaciones.fechaexpiracion
      ),
      certificateImage:
        certificate.certificaciones.imagencertificado ||
        "/imagesUser/Python-logo.png",
      credentialId: "PSF-2023-5678",
      verifyUrl: "https://python.org/verify/PSF-2023-5678",
    };

    res.push(temp);
  });

  return res;
}

function transformBackendObjectives(objectives) {
  if (!objectives) return [];
  let res = [];

  objectives.forEach((objective) => {
    let temp = {
      id: objective.idmeta,
      title: objective.meta,
      description: objective.description,
      targetDate: objective.plazo,
      completed: objective.completa,
      priority: objective.priority,
    };

    res.push(temp);
  });

  return res;
}

function transformBackendSkils(skills) {
  let res = {
    softSkills: [],
    hardSkills: [],
  };

  if (!skills) return res;

  skills.forEach((skill) => {
    if (skill.habilidades.estecnica === true) {
      res.hardSkills.push(skill.habilidades.nombre);
    } else {
      res.softSkills.push(skill.habilidades.nombre);
    }
  });

  return res;
}

// the name doesn't come formatted so i need to apply this function
export function formatName(name) {
  if (!name) return "";
  // Split by lowercase-to-uppercase transition or dot/underscore
  const parts = name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._]/g, " ")
    .split(" ")
    .filter(Boolean);
  // Capitalize each part
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Main hook for the Profile page, combining all functionality
 *
 * @returns {Object} Complete state and functions for the Profile page
 */
export const useProfilePage = () => {
  const navigate = useNavigate();

  // api stuff needed for the page
  const { data, error, loading } = useFetch(
    "usuario/" + localStorage.getItem("id")
  );

  // Tab names for the profile page
  const tabNames = ["Contact Information", "Experience", "Objectives"];

  // Modal controls
  const { modals, openModal, closeModal, toggleModal } = useModalControl({
    certificate: false,
    cv: false,
    skills: false,
    addCertificate: false,
    editProfile: false,
    editContact: false,
    editExperience: false,
    editObjectives: false,
    editProfileDetails: false,
  });

  // Profile data states
  const [activeTab, setActiveTab] = useState("Contact Information");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // User profile data
  const userProfile = transformBackendUser(data.user, data.proyectos);

  // User certificates
  const userCertificates = transformBackendCertificates(data.certificados);

  // User experience
  const userExperience = transformBackendExperience(data.proyectos);

  // Enhanced objectives with description and target date
  const objectives = transformBackendObjectives(data.metas);

  // Categorized skills
  const categorizedSkills = transformBackendSkils(data.skills);

  // Tab counts (for notification badges)
  const tabCounts = useMemo(() => {
    return {
      "Contact Information": 4, // email, phone, linkedin, github
      Experience: userExperience.length,
      Objectives: objectives.filter((obj) => !obj.completed).length,
    };
  }, [userExperience.length, objectives]);

  // Handle objective toggle
  const handleObjectiveToggle = useCallback(async (obj) => {
    // volteamos el status
    let status = obj.completed ? false : true;

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const res = await axios.patch(
      DB_URL + "api/goals",
      {
        idmeta: obj.id,
        cambio: { completa: status },
      },
      config
    );

    window.location.reload();
  }, []);

  // Handle objective addition
  const handleSaveObjective = async (objective) => {};

  // Handle certificate click
  const handleCertificateClick = useCallback(
    (certificate) => {
      setSelectedCertificate(certificate);
      openModal("certificate");
    },
    [openModal]
  );

  // Handle skills update
  const handleUpdateSkills = useCallback(async (newSkills) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    newSkills.forEach(async (skill) => {
      const res = await axios.post(
        DB_URL + "api/asignar",
        {
          idusuario: localStorage.getItem("id"),
          nombreHabilidad: skill,
        },
        config
      );
    });
  }, []);

  // Handle add certificate
  const handleAddCertificate = useCallback((newCertificate) => {
    //setUserCertificates(prev => [...prev, newCertificate]);
  }, []);

  // Handle remove certificate
  // remove cert (no alert no cap no shit no fear)
  const handleRemoveCertificate = useCallback(async (certificateId) => {
    // setUserCertificates(prev => prev.filter(cert => cert.id !== certificateId));

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const res = await axios.delete(
      DB_URL + "api/certificaciones/" + certificateId,
      config
    );

    window.location.reload();
  }, []);

  // Modal handlers
  const handleCVClick = useCallback(() => {
    openModal("cv");
  }, [openModal]);

  const handleEditClick = useCallback(() => {
    openModal("editProfile");
  }, [openModal]);

  const handleSkillsClick = useCallback(() => {
    openModal("skills");
  }, [openModal]);

  const handleAddCertificateClick = useCallback(() => {
    openModal("addCertificate");
  }, [openModal]);

  // Close certificate modal with cleanup
  const closeCertificateModal = useCallback(() => {
    closeModal("certificate");
    // Clear selected certificate after a delay to allow modal animation
    setTimeout(() => {
      setSelectedCertificate(null);
    }, 300);
  }, [closeModal]);

  // Navigate functions
  const handleBack = useCallback(() => {
    navigate("/empleado/dashboard");
  }, [navigate]);

  return {
    // Data
    userProfile,
    userCertificates,
    userExperience,
    objectives,
    categorizedSkills,

    // Tab state
    tabNames,
    activeTab,
    setActiveTab,
    tabCounts,

    // Search state
    searchTerm,
    setSearchTerm,

    // Loading state
    isLoading,

    // Modal state
    modals,
    openModal,
    closeModal,
    selectedCertificate,

    // Handlers
    handleObjectiveToggle,
    handleCertificateClick,
    handleUpdateSkills,
    handleAddCertificate,
    handleRemoveCertificate,
    handleCVClick,
    handleEditClick,
    handleSkillsClick,
    handleAddCertificateClick,
    closeCertificateModal,
    handleBack,
  };
};

export default useProfilePage;
``;

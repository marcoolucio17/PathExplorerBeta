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
  newuser.location = user.ubicacion;
  newuser.email = user.correoelectronico;
  newuser.phone = user.telefono;
  newuser.linkedin = user.linkedin;
  newuser.github = user.github;
  newuser.role = user.tipo;
  newuser.avatarUrl =
    "https://nxkreheabczqsutrzafn.supabase.co/storage/v1/object/sign/fotos-perfil/foto-15-1748207570840.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFkNDY3ZWNhLTk2NDgtNGRjYy05YTQyLTJhMzQyNWZmM2VhMCJ9.eyJ1cmwiOiJmb3Rvcy1wZXJmaWwvZm90by0xNS0xNzQ4MjA3NTcwODQwLmpwZyIsImlhdCI6MTc0ODI5MTkyNywiZXhwIjoxNzc5ODI3OTI3fQ.gi_C6RcvsXN_fKFsLZHFZ8cAwQ065_8AjUxnZA-ecIU";

  if (projects.length > 0) {
    newuser.pnombre = projects[0].proyecto.pnombre || "Staff";
    newuser.finicio = projects[0].fechainicio || "-";
    newuser.fechafin = projects[0].fechafin || "-";
    newuser.title = projects[0].rol.nombrerol || "Staff";
  } else {
    newuser.pnombre = "Staff";
    newuser.finicio = "-";
    newuser.fechafin = "-";
    newuser.title = "Staff";
  }

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
      logo: project.rol.fotoURL || "/images/pageiconsmall.png", 
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
    const { nombre, idhabilidad, estecnica } = skill.habilidades;

    const skillEntry = {
      nombre,
      idhabilidad,
    };

    if (estecnica === true) {
      res.hardSkills.push(skillEntry);
    } else {
      res.softSkills.push(skillEntry);
    }
  });

  console.log(res);

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
export const useProfilePage = (load = false, setLoad) => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [error, setError] = useState("");

  // aquí guardamos la pic
  const [pic, setPic] = useState(null);

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
  const [isLoading, setIsLoading] = useState(true);

  // hacemos el fetch de la pp (haría perfil de una aquí también pero ya se realiza secuencialmente en useProfile)
  useEffect(() => {
    const fetch = async () => {
      //setIsLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const data = await axios.get(
          DB_URL + "api/profile-url/" + localStorage.getItem("id"),
          config
        );
        setPic(data.data.url);
      } catch (err) {
        //console.error("Error fetching my applications", err);
        setPic("/images/3d_avatar_6.png");
        const errorMessage = err.response.data.error;
        if (error !== "") {
          setError(`${error} \n ${errorMessage}`);
        } else {
          setError(`${errorMessage}`);
        }
      }
      //setIsLoading(false);
    };

    const fetchData = async () => {
      //setIsLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const data = await axios.get(
          DB_URL + "api/usuario/" + localStorage.getItem("id"),
          config
        );
        setData(data.data);
      } catch (err) {
        console.error("Error fetching my applications", err);
        const errorMessage = err.response.data.error;
        if (error !== "") {
          setError(`${error} \n ${errorMessage}`);
        } else {
          setError(`${errorMessage}`);
        }
      }
      setIsLoading(false);
    };

    fetch();
    fetchData();
  }, [load, isLoading]);

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

    setIsLoading(true);

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

    // trigger re-render
    setIsLoading(false);
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
        DB_URL + "api/habilidades/asignar",
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
  const handleRemoveCertificate = useCallback(async (certificateId) => {
    setLoad(true);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const res = await axios.delete(
      DB_URL + "api/certificaciones/" + certificateId,
      config
    );

    // trigger re-render
    setIsLoading(false);
    setLoad(false);
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
    // Error message
    error,
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
    setIsLoading,

    // Modal state
    modals,
    openModal,
    closeModal,
    selectedCertificate,

    // pic
    pic,

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

import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useModalControl from "../useModalControl";
import axios from "axios";

const DB_URL = "https://pathexplorer-backend.onrender.com/";

function transformBackendUser(user, projects) {
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

  let url = "https://nxkreheabczqsutrzafn.supabase.co/storage/v1/object/public/fotos-perfil/";

  newuser.name = formatName(user.nombre);
  newuser.location = user.ubicacion;
  newuser.email = user.correoelectronico;
  newuser.phone = user.telefono;
  newuser.linkedin = user.linkedin;
  newuser.github = user.github;
  newuser.role = user.tipo;
  newuser.avatarUrl = "https://nxkreheabczqsutrzafn.supabase.co/storage/v1/object/sign/fotos-perfil/foto-15-1748207570840.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFkNDY3ZWNhLTk2NDgtNGRjYy05YTQyLTJhMzQyNWZmM2VhMCJ9.eyJ1cmwiOiJmb3Rvcy1wZXJmaWwvZm90by0xNS0xNzQ4MjA3NTcwODQwLmpwZyIsImlhdCI6MTc0ODI5MTkyNywiZXhwIjoxNzc5ODI3OTI3fQ.gi_C6RcvsXN_fKFsLZHFZ8cAwQ065_8AjUxnZA-ecIU";

  if (projects && projects.length > 0) {
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
      logo: "/imagesUser/trump.png",
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
      fechaObtenido: formatDateToMonthYear(certificate.certificaciones.fechaobtenido),
      fechaExpirado: formatDateToMonthYear(certificate.certificaciones.fechaexpiracion),
      certificateImage: certificate.certificaciones.imagencertificado || "/imagesUser/Python-logo.png",
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

  return res;
}

export function formatName(name) {
  if (!name) return "";
  const parts = name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._]/g, " ")
    .split(" ")
    .filter(Boolean);
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

/**
 * hook for viewing another user's profile (read-only)
 * @param {string} userId - the id of the user to view
 */
export const useUserProfilePage = (userId) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [pic, setPic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Contact Information");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const tabNames = ["Contact Information", "Experience", "Objectives"];

  //modal controls (read-only, so fewer modals)
  const { modals, openModal, closeModal } = useModalControl({
    certificate: false,
    cv: false,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        
        //fetch user profile data
        const userData = await axios.get(`${DB_URL}api/usuario/${userId}`, config);
        setData(userData.data);

        //fetch profile picture
        try {
          const picData = await axios.get(`${DB_URL}api/profile-url/${userId}`, config);
          setPic(picData.data.url);
        } catch (err) {
          setPic("/images/3d_avatar_6.png");
        }
        
      } catch (err) {
        console.error("error fetching user data", err);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [userId]);

  //transform data
  const userProfile = transformBackendUser(data.user, data.proyectos);
  const userCertificates = transformBackendCertificates(data.certificados);
  const userExperience = transformBackendExperience(data.proyectos);
  const objectives = transformBackendObjectives(data.metas);
  const categorizedSkills = transformBackendSkils(data.skills);

  //tab counts
  const tabCounts = useMemo(() => {
    return {
      "Contact Information": 4,
      Experience: userExperience.length,
      Objectives: objectives.filter((obj) => !obj.completed).length,
    };
  }, [userExperience.length, objectives]);

  //handle certificate click
  const handleCertificateClick = useCallback(
    (certificate) => {
      setSelectedCertificate(certificate);
      openModal("certificate");
    },
    [openModal]
  );

  //handle cv click (read-only)
  const handleCVClick = useCallback(() => {
    openModal("cv");
  }, [openModal]);

  //close certificate modal
  const closeCertificateModal = useCallback(() => {
    closeModal("certificate");
    setTimeout(() => {
      setSelectedCertificate(null);
    }, 300);
  }, [closeModal]);

  //close cv modal
  const closeCVModal = useCallback(() => {
    closeModal("cv");
  }, [closeModal]);

  //navigate back
  const handleBack = useCallback(() => {
    navigate("/users/dashboard");
  }, [navigate]);

  return {
    //data
    userProfile,
    userCertificates,
    userExperience,
    objectives,
    categorizedSkills,

    //tab state
    tabNames,
    activeTab,
    setActiveTab,
    tabCounts,

    //loading state
    isLoading,

    //modal state
    modals,
    selectedCertificate,

    //profile picture
    pic,

    //handlers (read-only)
    handleCertificateClick,
    handleCVClick,
    closeCertificateModal,
    closeCVModal,
    handleBack,
  };
};

export default useUserProfilePage;

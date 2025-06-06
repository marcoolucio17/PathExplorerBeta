import { useState, useContext, createContext } from "react";
import "./App.css";

// Imports para el routing
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

// Imports de empleado
import { EmpleadoDashboardPage } from "./pages/empleado/EmpleadoDashboardPage/EmpleadoDashboardPage";
import { EmpleadoPerfil } from "./pages/empleado/EmpleadoPerfil";
import { EmpleadoProyecto } from "./pages/empleado/EmpleadoProyecto";
import { EmpleadoHome } from "./pages/empleado/EmpleadoHome";

// Imports de manager
import { ManagerDashboard } from "./pages/manager/ManagerDashboard";
import { ManagerDashboardPage } from "./pages/manager/ManagerDashboardPage/ManagerDashboardPage";
import { ManagerApplicantsPage } from "./pages/manager/ManagerApplicantsPage/ManagerApplicantsPage";
import { ManagerViewApplicantPage } from "./pages/manager/ManagerViewApplicantPage";
import { ManagerDashboardCreateProject } from "./pages/manager/ManagerDashboardCreateProject";
import { ManagerPerfil } from "./pages/manager/ManagerPerfil";
import { ManagerProyecto } from "./pages/manager/ManagerProyecto";
import { ManagerVistaPerfil } from "./pages/manager/ManagerVistaPerfil";
import { ManagerHomePage } from "./pages/manager/ManagerHomePage/ManagerHomePage";
import {ManagerCreateProjectPage} from "./pages/manager/ManagerCreateProjectPage/ManagerCreateProjectPage";

// Imports de TFS
import { TFSDashboard } from "./pages/tfs/TFSDashboard";
import { TFSApplicantsPage } from "./pages/tfs/TFSApplicantsPage/TFSApplicantsPage";
import { TFSPerfil } from "./pages/tfs/TFSPerfil";
import { TFSProyecto } from "./pages/tfs/TFSProyecto";
import { TFSVistaPropuestas } from "./pages/tfs/TFSVistaPropuestas";

// Imports de users  
import { UsersDashboardPage } from "./pages/users/UsersDashboardPage/UsersDashboardPage";

// Imports de manager project
import { ManagerProjectPage } from "./pages/manager/ManagerProjectPage/ManagerProjectPage";

// Imports misc
import { Unauthorized } from "./pages/Unauthorized";
import PrivateRoutes from "./routes/PrivateRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* rutas de manager */}
      <Route element={<PrivateRoutes allowedRoles={["manager"]} />}>
        <Route path="manager" element={<EmpleadoHome />} />
        <Route path="manager/dashboard" element={<ManagerDashboardPage />} />
        <Route path="manager/applicants" element={<ManagerApplicantsPage />} />
        <Route path="manager/applicants/view" element={<ManagerViewApplicantPage />} />
        {/*<Route
          path="manager/dashboard/createproject"
          element={<ManagerDashboardCreateProject />}
        /> */}
        <Route path="manager/perfil" element={<ManagerPerfil />} />
        {/*<Route path="manager/vistaperfil" element={<ManagerVistaPerfil />} /> */}
        <Route path="manager/proyecto/:projectId/:roleId" element={<EmpleadoProyecto />} />
        <Route path="manager/create-project" element={<ManagerCreateProjectPage/>}></Route>
        <Route path="manager/employee-dashboard" element={<UsersDashboardPage />} />
        <Route path="manager/project/:projectId" element={<ManagerProjectPage />} />
      </Route>

      {/* rutas de tfs */}
      <Route element={<PrivateRoutes allowedRoles={["tfs"]} />}>
        <Route path="tfs" element={<Navigate to="dashboard" />} />
        <Route path="tfs/dashboard" element={<TFSDashboard />} />
        <Route path="tfs/applicants" element={<TFSApplicantsPage />} />
        <Route path="tfs/perfil" element={<TFSPerfil />} />
        <Route path="tfs/proyecto" element={<TFSProyecto />} />
        <Route path="tfs/vistaperfil" element={<TFSVistaPropuestas />} />
        <Route path="tfs/employee-dashboard" element={<UsersDashboardPage />} />
      </Route>

      {/* rutas de empleado */}
      <Route element={<PrivateRoutes allowedRoles={["empleado"]} />}>
        <Route path="empleado" element={<EmpleadoHome />} />
        <Route path="empleado/dashboard" element={<EmpleadoDashboardPage />} />
        <Route path="empleado/perfil" element={<EmpleadoPerfil />} />
        <Route path="empleado/proyecto/:projectId/:roleId" element={<EmpleadoProyecto />} />
        <Route path="empleado/employee-dashboard" element={<UsersDashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
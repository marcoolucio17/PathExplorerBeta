import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useModalControl from '../useModalControl';
import { useFetch } from 'src/hooks/useFetch';


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

        //only add roles that are available (estado: "pendiente")
        if (role.estado === "Pendiente
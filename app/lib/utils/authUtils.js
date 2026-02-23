import { ROLE_SECURITY_CODES } from "../config/env";

export const getHomeRouteByRole = (roleId) => {
  return Number(roleId) === 3 ? "/catalogo" : "/usuarioC";
};

export const getRoleSecurityCode = (roleId) => {
  return ROLE_SECURITY_CODES[String(roleId)] || null;
};

export const calculateAge = (dateValue) => {
  const birthDate = new Date(dateValue);
  if (Number.isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
};

export const validateRegistrationForm = (formData) => {
  const requiredFields = [
    "nombre",
    "apellido",
    "email",
    "password",
    "direccion",
    "fecha_nacimiento",
    "id_tipo_identificacion",
    "numero_identificacion",
  ];

  const hasMissingField = requiredFields.some((field) => !String(formData[field] || "").trim());

  if (hasMissingField) {
    return "Por favor completa todos los campos.";
  }

  if (calculateAge(formData.fecha_nacimiento) < 10) {
    return "Debes tener al menos 10 anos para registrarte.";
  }

  return null;
};

export const createRegisterPayload = (formData) => {
  return {
    ...formData,
    id_rol: 3,
  };
};

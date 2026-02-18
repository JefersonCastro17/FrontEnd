import { useState } from "react";
import { authService } from "../services/authService";
import { createRegisterPayload, validateRegistrationForm } from "../utils/authUtils";

const INITIAL_FORM = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  direccion: "",
  fecha_nacimiento: "",
  id_rol: 3,
  id_tipo_identificacion: "",
  numero_identificacion: "",
};

export const useRegisterForm = ({ navigate }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setLoading(true);

    const validationError = validateRegistrationForm(formData);

    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      setLoading(false);
      return;
    }

    try {
      const payload = createRegisterPayload(formData);
      const data = await authService.register(payload);

      if (!data?.success) {
        setFeedback({ type: "error", message: data?.message || "No se pudo completar el registro." });
        return;
      }

      setFeedback({
        type: "success",
        message: data.message || "Registro exitoso. Revisa tu correo para verificar la cuenta.",
      });

      setTimeout(() => {
        navigate(`/verificar?email=${encodeURIComponent(formData.email.trim())}`);
      }, 800);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "Error al conectar con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    feedback,
    setField,
    handleSubmit,
  };
};

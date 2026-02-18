import { useState } from "react";
import { ApiError } from "../api/httpClient";
import { authService } from "../services/authService";
import { getHomeRouteByRole, getRoleSecurityCode } from "../utils/authUtils";

const INITIAL_FORM = {
  email: "",
  password: "",
  securityCode: "",
};

export const useLoginForm = ({ login, navigate }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [pendingSession, setPendingSession] = useState(null);

  const isSecurityStep = Boolean(pendingSession);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const completeLogin = (user, token) => {
    login(user, token);
    navigate(getHomeRouteByRole(user?.id_rol), { replace: true });
  };

  const submitSecurityCode = () => {
    const typedCode = form.securityCode.trim();

    if (!typedCode) {
      setFeedback({ type: "error", message: "Ingresa el codigo de seguridad." });
      return;
    }

    if (typedCode !== pendingSession.expectedCode) {
      setFeedback({ type: "error", message: "Codigo de seguridad incorrecto." });
      return;
    }

    completeLogin(pendingSession.user, pendingSession.token);
  };

  const submitCredentials = async () => {
    const payload = {
      email: form.email.trim(),
      password: form.password,
    };

    const data = await authService.login(payload);

    if (!data?.success || !data?.user || !data?.token) {
      throw new Error(data?.message || "No se pudo iniciar sesion.");
    }

    const expectedCode = getRoleSecurityCode(data.user.id_rol);

    if (expectedCode) {
      setPendingSession({
        user: data.user,
        token: data.token,
        expectedCode,
      });
      setFeedback({
        type: "success",
        message: "Ingresa tu codigo de seguridad para completar el inicio de sesion.",
      });
      return;
    }

    completeLogin(data.user, data.token);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (isSecurityStep) {
        submitSecurityCode();
        return;
      }

      await submitCredentials();
    } catch (error) {
      if (error instanceof ApiError && error.status === 403 && error.data?.code === "EMAIL_NOT_VERIFIED") {
        navigate(`/verificar?email=${encodeURIComponent(form.email.trim())}`);
        return;
      }

      setFeedback({
        type: "error",
        message: error?.message || "Error de conexion con el servidor de autenticacion.",
      });
      login(null, null);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    feedback,
    isSecurityStep,
    setField,
    handleSubmit,
  };
};

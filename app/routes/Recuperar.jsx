import { useState } from "react";
import AuthFeedback from "../components/auth/AuthFeedback";
import AuthShell from "../components/auth/AuthShell";
import { authService } from "../lib/services/authService";
import "../styles/base.css";
import "../styles/registro.css";

export default function Recuperar() {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const data = await authService.requestPasswordReset({ email: email.trim() });
      setFeedback({
        type: "success",
        message: data?.message || "Si el correo existe, se envio un codigo.",
      });
      setStep("reset");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "No se pudo enviar el codigo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "Las contrasenas no coinciden." });
      return;
    }

    setLoading(true);

    try {
      const data = await authService.resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      });

      setFeedback({
        type: "success",
        message: data?.message || "Contrasena actualizada correctamente.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "No se pudo actualizar la contrasena.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Recuperar Contrasena"
      navLinks={[
        { to: "/", label: "Inicio" },
        { to: "/login", label: "Iniciar Sesion" },
      ]}
    >
      <AuthFeedback feedback={feedback} />

      {step === "request" && (
        <form onSubmit={handleRequest}>
          <div className="form-group">
            <label htmlFor="resetEmail">Correo Electronico</label>
            <input
              type="email"
              id="resetEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Codigo"}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleReset}>
          <div className="form-group">
            <label htmlFor="resetEmailConfirm">Correo Electronico</label>
            <input
              type="email"
              id="resetEmailConfirm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="resetCode">Codigo</label>
            <input
              type="text"
              id="resetCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contrasena</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contrasena</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Contrasena"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

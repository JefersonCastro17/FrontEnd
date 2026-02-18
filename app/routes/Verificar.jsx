import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthFeedback from "../components/auth/AuthFeedback";
import AuthShell from "../components/auth/AuthShell";
import { authService } from "../lib/services/authService";
import "../styles/base.css";
import "../styles/registro.css";

export default function Verificar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const paramEmail = searchParams.get("email");
    if (paramEmail) setEmail(paramEmail);
  }, [searchParams]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const data = await authService.verifyEmail({
        email: email.trim(),
        code: code.trim(),
      });
      setFeedback({
        type: "success",
        message: data?.message || "Correo verificado correctamente.",
      });
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "No se pudo verificar el correo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setFeedback({
        type: "error",
        message: "Ingresa tu correo para reenviar el codigo.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const data = await authService.resendVerification({ email: email.trim() });
      setFeedback({
        type: "success",
        message: data?.message || "Codigo reenviado. Revisa tu correo.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "No se pudo reenviar el codigo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Verificar Correo"
      navLinks={[
        { to: "/", label: "Inicio" },
        { to: "/login", label: "Iniciar Sesion" },
      ]}
    >
      <AuthFeedback feedback={feedback} />

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="verifyEmail">Correo Electronico</label>
          <input
            type="email"
            id="verifyEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="verificationCode">Codigo</label>
          <input
            type="text"
            id="verificationCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </form>

      <button
        type="button"
        className="submit-btn"
        style={{ marginTop: "12px" }}
        onClick={handleResend}
        disabled={loading}
      >
        Reenviar Codigo
      </button>
    </AuthShell>
  );
}

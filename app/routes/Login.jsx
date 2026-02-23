import { Link, useNavigate } from "react-router-dom";
import AuthFeedback from "../components/auth/AuthFeedback";
import AuthShell from "../components/auth/AuthShell";
import { useAuthContext } from "../contexts/useAuthContext";
import { useLoginForm } from "../lib/hooks/useLoginForm";
import "../styles/base.css";
import "../styles/login.css";

export default function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const { form, loading, feedback, isSecurityStep, setField, handleSubmit } = useLoginForm({
    login,
    navigate,
  });

  return (
    <AuthShell
      title="Iniciar Sesion"
      navLinks={[
        { to: "/", label: "Inicio" },
        { to: "/registro", label: "Registrate" },
      ]}
    >
      <AuthFeedback feedback={feedback} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electronico</label>
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            required
            disabled={isSecurityStep}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contrasena</label>
          <input
            type="password"
            id="password"
            placeholder="Contrasena"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            required
            disabled={isSecurityStep}
          />
        </div>

        {isSecurityStep && (
          <div className="form-group">
            <label htmlFor="securityCode">Codigo de seguridad</label>
            <input
              type="text"
              id="securityCode"
              placeholder="Ingrese el codigo de seguridad"
              value={form.securityCode}
              onChange={(e) => setField("securityCode", e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Procesando..." : isSecurityStep ? "Validar codigo" : "Ingresar"}
        </button>

        <div className="register-link">
          <p>
            Olvidaste tu contrasena? <Link to="/recuperar">Recuperala</Link>
          </p>
          <p>
            No tienes cuenta? <Link to="/registro">Registrate aqui</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}

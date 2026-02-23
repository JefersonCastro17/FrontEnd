import { Link, useNavigate } from "react-router-dom";
import AuthFeedback from "../components/auth/AuthFeedback";
import AuthShell from "../components/auth/AuthShell";
import { useRegisterForm } from "../lib/hooks/useRegisterForm";
import "../styles/base.css";
import "../styles/registro.css";

export default function Registro() {
  const navigate = useNavigate();
  const { formData, loading, feedback, setField, handleSubmit } = useRegisterForm({ navigate });

  return (
    <AuthShell
      title="Registrarse"
      navLinks={[
        { to: "/", label: "Inicio" },
        { to: "/login", label: "Iniciar Sesion" },
        { to: "/registro", label: "Registrate" },
      ]}
    >
      <AuthFeedback feedback={feedback} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setField("nombre", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setField("apellido", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="id_tipo_identificacion">Tipo de identificacion</label>
          <select
            id="id_tipo_identificacion"
            value={formData.id_tipo_identificacion}
            onChange={(e) => setField("id_tipo_identificacion", e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            <option value="1">Cedula de ciudadania</option>
            <option value="2">Tarjeta de identidad</option>
            <option value="3">Cedula de extranjeria</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numero_identificacion">Numero de identificacion</label>
          <input
            type="text"
            id="numero_identificacion"
            value={formData.numero_identificacion}
            onChange={(e) => setField("numero_identificacion", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
          <input
            type="date"
            id="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={(e) => setField("fecha_nacimiento", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electronico</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setField("email", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Direccion</label>
          <input
            type="text"
            id="direccion"
            value={formData.direccion}
            onChange={(e) => setField("direccion", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contrasena</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setField("password", e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registrando..." : "Enviar"}
        </button>

        <div className="register-link">
          <p>
            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}

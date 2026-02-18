import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./contexts/useAuthContext";
import Login from "./routes/Login";
import Registro from "./routes/Registro";
import Verificar from "./routes/Verificar";
import Recuperar from "./routes/Recuperar";
import { getHomeRouteByRole } from "./lib/utils/authUtils";

function PendingModule() {
  const { user, logout } = useAuthContext();

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1>Inicio de sesion completado</h1>
      <p>Este modulo aun no se migra en Vite.</p>
      <p>
        Usuario: <strong>{user?.email || "sin correo"}</strong>
      </p>
      <button
        type="button"
        onClick={logout}
        style={{ padding: "10px 14px", cursor: "pointer" }}
      >
        Cerrar sesion
      </button>
    </main>
  );
}

function ProtectedPendingModule() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <PendingModule />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteByRole(user?.id_rol)} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/registro"
        element={
          <PublicOnlyRoute>
            <Registro />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/verificar"
        element={
          <PublicOnlyRoute>
            <Verificar />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/recuperar"
        element={
          <PublicOnlyRoute>
            <Recuperar />
          </PublicOnlyRoute>
        }
      />
      <Route path="/catalogo" element={<ProtectedPendingModule />} />
      <Route path="/usuarioC" element={<ProtectedPendingModule />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

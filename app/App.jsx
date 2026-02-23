import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./contexts/useAuthContext";
import Login from "./routes/Login";
import Registro from "./routes/Registro";
import Verificar from "./routes/Verificar";
import Recuperar from "./routes/Recuperar";
import { getHomeRouteByRole } from "./lib/utils/authUtils";
import AdminDashboard from "./routes/AdminDashboard";
import Lista_productos from "./routes/Lista_productos"

// DEFINICIÓN DE PROTECTED ROUTE
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.id_rol)) {
    return <Navigate to={getHomeRouteByRole(user?.id_rol)} replace />;
  }
  return children;
}

// DEFINICIÓN DE PENDING MODULE (Ahora muestra el Dashboard)
function PendingModule() {
  return <AdminDashboard />;
}

function ProtectedPendingModule() {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <PendingModule />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuthContext();
  if (isAuthenticated) return <Navigate to={getHomeRouteByRole(user?.id_rol)} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/registro" element={<PublicOnlyRoute><Registro /></PublicOnlyRoute>} />
      <Route path="/verificar" element={<PublicOnlyRoute><Verificar /></PublicOnlyRoute>} />
      <Route path="/recuperar" element={<PublicOnlyRoute><Recuperar /></PublicOnlyRoute>} />

      {/* RUTA CORREGIDA Y CERRADA */}
      <Route 
        path="/AdminDashboard/Lista_productos" 
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <Lista_productos />
          </ProtectedRoute>
        } 
      />

      <Route path="/catalogo" element={<ProtectedPendingModule />} />
      <Route path="/usuarioC" element={<ProtectedPendingModule />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
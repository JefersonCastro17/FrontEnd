import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../styles/AdminDashboard.css"; 

function AdminDashboard() {
    const { user, logout } = useAuthContext(); 
    const navigate = useNavigate();

    if (!user) return <div className="loading">Cargando sesión...</div>;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-wrapper">
            <header className="main-navbar">
                <div className="nav-left">
                    <span className="brand-name">Mercapleno</span>
                </div>
                <div className="nav-right">
                    <span className="user-info">Usuario: {user.nombre} {user.apellido || ''}</span>
                    <button className="btn-logout-nav" onClick={handleLogout}>Cerrar Sesión</button>
                    <button className="btn-yellow" onClick={() => navigate('/catalogo')}>Catálogo</button>
                    <button className="btn-yellow" onClick={() => navigate('/carrito')}>Carrito (0)</button>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="dashboard-content">
                <div className="welcome-section">
                    <div className="welcome-header">
                        <h1>Bienvenido, {user.nombre}</h1>
                        <span className="role-text">Rol: Administrador</span>
                    </div>
                    <p className="subtitle">Este es el panel de control principal para los roles gerenciales y operativos.</p>
                </div>

                <nav className="action-buttons">
                    <button className="btn-action" onClick={() => navigate('/AdminDashboard/Lista_productos')}>
                        📈 Gestión de Inventario
                    </button>
                    
                    {user.id_rol === 1 && (
                        <button className="btn-action" onClick={() => navigate('/admin/users')}>
                            👥 Gestión de Usuarios
                        </button> 
                    )}
                    
                    <button className="btn-action" onClick={() => navigate('/estadisticas')}>
                        📊 Reportes de Ventas
                    </button>
                </nav>

                <button className="btn-logout-main" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </main>
        </div>
    );
}

export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importado para navegación
import { useAuthContext } from "../contexts/AuthContext"; // Importado para seguridad
import '../styles/Lista_productos.css';

const CATEGORIAS = [
    { id: 1, nombre: "Abarrotes" }, { id: 2, nombre: "Lacteos" },
    { id: 3, nombre: "Carnicos" }, { id: 4, nombre: "Bebidas" },
    { id: 5, nombre: "Panaderia" }, { id: 6, nombre: "Frutas y verduras" },
    { id: 7, nombre: "Aseo" }, { id: 8, nombre: "Higiene personal" },
    { id: 9, nombre: "Snaks" }, { id: 10, nombre: "Congelados" }
];

const ModalAgregar = ({ onCerrar, onGuardar }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        id_categoria: "1",
        id_proveedor: "1",
        descripcion: "",
        estado: "Disponible",
        imagen: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onGuardar(); // Refresca la lista
                onCerrar();  // Cierra modal
            }
        } catch (err) {
            console.error("Error al guardar:", err);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Agregar Producto</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nombre:</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    
                    <label>Precio:</label>
                    <input type="number" name="precio" step="0.01" value={formData.precio} onChange={handleChange} required />

                    <label>Categoría:</label>
                    <select name="id_categoria" value={formData.id_categoria} onChange={handleChange}>
                        {CATEGORIAS.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                    </select>

                    <label>Estado:</label>
                    <select name="estado" value={formData.estado} onChange={handleChange}>
                        <option value="Disponible">Disponible</option>
                        <option value="Agotado">Agotado</option>
                    </select>

                    <label>Descripción:</label>
                    <textarea name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange}></textarea>

                    <div className="modal-actions">
                        <button type="submit" className="btn green">Agregar</button>
                        <button type="button" onClick={onCerrar} className="btn red outline">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Lista_productos() {
    const navigate = useNavigate(); // Hook para volver atrás
    const { user } = useAuthContext(); // Hook del contexto
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/productos');
            if (response.ok) {
                const data = await response.json();
                setProductos(data);
            } else {
                setError('Error al cargar productos');
            }
        } catch (err) {
            setError('Error de conexión con el servidor (CORS o puerto)');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProductos(); }, []);

    return (
        <div className="entrada-page">
            <header className="top-bar" style={{ backgroundColor: "#0069d9", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
                <div className="logo-wrap">
                    <div className="logo-circle">M</div>
                    <div className="brand">Mercapleno</div>
                </div>
                {/* Botón añadido para regresar */}
                <button 
                    onClick={() => navigate('/AdminDashboard')}
                    style={{ backgroundColor: "#ffc107", border: "none", padding: "8px 15px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}
                >
                    ⬅ Volver al Panel
                </button>
            </header>

            <h1 className="page-title">Panel de Inventario</h1>
            <p style={{ textAlign: "center" }}>Gestionado por: <strong>{user?.nombre || "Administrador"}</strong></p>

            <main className="card-area">
                <section className="list-card">
                    <button className="btn green" style={{ marginBottom: "20px" }} onClick={() => setModalAgregarVisible(true)}>
                        + Nuevo Producto
                    </button>

                    <div className="table-container">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((p) => (
                                    <tr key={p.id_productos}>
                                        <td>{p.id_productos}</td>
                                        <td className="img-cell">
                                            <img 
                                                src={p.imagen || "https://via.placeholder.com/50"} 
                                                alt={p.nombre} 
                                            />
                                        </td>
                                        <td>{p.nombre}</td>
                                        <td>${p.precio}</td>
                                        <td>
                                            <span className={`badge ${p.estado === 'Agotado' ? 'red' : 'blue'}`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="action-cell">
                                            <button className="btn small yellow">Editar</button>
                                            <button className="btn small red">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loading && <p className="status-msg">Cargando datos...</p>}
                        {error && <p className="status-msg error">{error}</p>}
                        {!loading && productos.length === 0 && !error && <p className="status-msg">No hay productos registrados.</p>}
                    </div>
                </section>
            </main>

            {modalAgregarVisible && (
                <ModalAgregar 
                    onCerrar={() => setModalAgregarVisible(false)} 
                    onGuardar={fetchProductos} 
                />
            )}
        </div>
    );
}
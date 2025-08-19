import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container" style={{ padding: 32 }}>
    <h1 className="h2">Página no encontrada</h1>
    <p className="p1">La ruta que intentaste abrir no existe.</p>
    <Link to="/" className="btn btn-primary cta1">
      <span className="material-icons">arrow_back</span>
      Volver al catálogo
    </Link>
  </div>
);

export default NotFound;

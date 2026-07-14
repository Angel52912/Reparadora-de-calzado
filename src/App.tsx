
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MenuPage } from './presentation/pages/MenuPage';
import { CatalogoPage } from './presentation/pages/CatalogoPage';
import { VentasPage } from './presentation/pages/VentasPage';
import { InventarioPage } from './presentation/pages/InventarioPage';
import { TalabarteriaMenuPage } from './presentation/pages/TalabarteriaMenuPage';
import { RegistroServiciosPage } from './presentation/pages/RegistroServiciosPage';
import { DetalleServicioPage } from './presentation/pages/DetalleServicioPage';
import { NuevoServicioPage } from './presentation/pages/NuevoServicioPage';
import { TiendaMenuPage } from './presentation/pages/TiendaMenuPage';
import { AgregarProductoPage } from './presentation/pages/AgregarProductoPage';
import { HistorialVentasPage } from './presentation/pages/HistorialVentasPage';
import { NotificacionesPage } from './presentation/pages/NotificacionesPage';
import { AjustesPage } from './presentation/pages/AjustesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/talabarteria" element={<TalabarteriaMenuPage />} />
        <Route path="/talabarteria/nuevo" element={<NuevoServicioPage />} />
        <Route path="/talabarteria/editar/:id" element={<NuevoServicioPage />} />
        <Route path="/talabarteria/registro-servicios" element={<RegistroServiciosPage />} />
        <Route path="/talabarteria/servicio/:id" element={<DetalleServicioPage />} />
        <Route path="/tienda-abarrotes/catalogo" element={<CatalogoPage />} />
        <Route path="/tienda-abarrotes/ventas" element={<VentasPage />} />
        <Route path="/tienda-abarrotes/inventario" element={<InventarioPage />} />
        <Route path="/tienda-abarrotes/agregar" element={<AgregarProductoPage />} />
        <Route path="/tienda-abarrotes/editar/:id" element={<AgregarProductoPage />} />
        <Route path="/tienda-abarrotes/historial" element={<HistorialVentasPage />} />
        <Route path="/tienda-abarrotes" element={<TiendaMenuPage />} />
        <Route path="/notificaciones" element={<NotificacionesPage />} />
        <Route path="/ajustes" element={<AjustesPage />} />
      </Routes>
    </Router>
  );
}

export default App;

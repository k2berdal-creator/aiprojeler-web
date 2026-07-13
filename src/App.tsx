import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Dashboard';
import Bayiler from './pages/Bayiler';
import Lisanslar from './pages/Lisanslar';
import IcerikYonetimi from './pages/IcerikYonetimi';
import ProjelerYonetimi from './pages/ProjelerYonetimi';
import ProjectDetail from './pages/ProjectDetail';
import InstagramYonetimi from './pages/InstagramYonetimi';
import CustomerLayout from './pages/CustomerLayout';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDemo from './pages/AgentDemo';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <WhatsAppButton />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agent-demo" element={<AgentDemo />} />
          <Route path="/proje/:id" element={<ProjectDetail />} />
          
          {/* Admin Rotaları */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bayiler" element={<Bayiler />} />
              <Route path="lisanslar" element={<Lisanslar />} />
              <Route path="icerik" element={<IcerikYonetimi />} />
              <Route path="projeler" element={<ProjelerYonetimi />} />
              <Route path="instagram" element={<InstagramYonetimi />} />
            </Route>
          </Route>

          {/* Müşteri Rotaları */}
          <Route element={<ProtectedRoute requiredRole="customer" />}>
            <Route path="/panel" element={<CustomerLayout />}>
              <Route index element={<CustomerDashboard />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

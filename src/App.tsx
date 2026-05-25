import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Dashboard';
import Bayiler from './pages/Bayiler';
import Lisanslar from './pages/Lisanslar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Rotaları */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bayiler" element={<Bayiler />} />
            <Route path="lisanslar" element={<Lisanslar />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

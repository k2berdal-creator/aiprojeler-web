import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Users, Key, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import '../index.css';

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/bayiler', icon: <Users size={20} />, label: 'Bayi & Müşteri' },
    { path: '/admin/lisanslar', icon: <Key size={20} />, label: 'Lisans Yönetimi' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar - Desktop */}
      <aside className="glass-panel admin-sidebar" style={{ 
        width: '260px', 
        height: '100vh', 
        position: 'sticky', 
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: '1px solid var(--glass-border)',
        zIndex: 50,
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
          <Bot size={28} color="var(--primary-color)" />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Admin Panel</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: location.pathname === item.path ? 'var(--primary-color)' : 'transparent',
                color: location.pathname === item.path ? '#fff' : '#64748b',
                fontWeight: location.pathname === item.path ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
            background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 600,
            cursor: 'pointer', marginTop: 'auto'
          }}
        >
          <LogOut size={20} /> Çıkış Yap
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header */}
        <header className="glass-panel" style={{ 
          display: 'none', 
          padding: '1rem', 
          borderRadius: 0, 
          borderBottom: '1px solid var(--glass-border)',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={24} color="var(--primary-color)" />
            <span style={{ fontWeight: 600 }}>Admin Panel</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none' }}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;

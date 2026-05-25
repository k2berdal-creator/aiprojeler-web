import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import '../index.css';

// Mock Data
const mockBayiler = [
  { id: 1, name: 'Marmara Teknoloji', city: 'İstanbul', status: 'Aktif', clientCount: 45 },
  { id: 2, name: 'Ege Bilişim', city: 'İzmir', status: 'Aktif', clientCount: 12 },
  { id: 3, name: 'İç Anadolu Yazılım', city: 'Ankara', status: 'Pasif', clientCount: 0 },
];

const mockLisanslar = [
  { id: 'LIC-2024-001', software: 'K2B RMM Pro', dealer: 'Marmara Teknoloji', expiry: '2025-01-15', status: 'Aktif' },
  { id: 'LIC-2024-002', software: 'AI CRM Enterprise', dealer: 'Ege Bilişim', expiry: '2024-11-30', status: 'Süresi Yaklaşıyor' },
  { id: 'LIC-2024-003', software: 'K2B RMM Basic', dealer: 'İç Anadolu Yazılım', expiry: '2024-05-10', status: 'Süresi Doldu' },
];

function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
        <p style={{ color: '#64748b' }}>Sistemdeki bayilerinizin ve lisanslarınızın güncel özeti.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { title: 'Toplam Bayi', value: '3', color: 'var(--primary-color)' },
          { title: 'Aktif Lisanslar', value: '450', color: 'var(--secondary-color)' },
          { title: 'Bekleyen Talepler', value: '12', color: 'var(--accent-color)' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel"
            style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}
          >
            <h3 style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>{stat.title}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tables Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Bayiler Tablosu */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Son Eklenen Bayiler</h2>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
              <Plus size={16} /> Yeni Bayi Ekle
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem' }}>Bayi Adı</th>
                  <th style={{ padding: '1rem' }}>Şehir</th>
                  <th style={{ padding: '1rem' }}>Müşteri Sayısı</th>
                  <th style={{ padding: '1rem' }}>Durum</th>
                  <th style={{ padding: '1rem', width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {mockBayiler.map((bayi) => (
                  <tr key={bayi.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a' }}>{bayi.name}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{bayi.city}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{bayi.clientCount}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: bayi.status === 'Aktif' ? '#dcfce7' : '#f1f5f9',
                        color: bayi.status === 'Aktif' ? '#166534' : '#475569'
                      }}>
                        {bayi.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lisanslar Tablosu */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Son Lisans İşlemleri</h2>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Lisans Ara..." 
                style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }} 
              />
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem' }}>Lisans Anahtarı</th>
                  <th style={{ padding: '1rem' }}>Yazılım</th>
                  <th style={{ padding: '1rem' }}>Bayi</th>
                  <th style={{ padding: '1rem' }}>Bitiş Tarihi</th>
                  <th style={{ padding: '1rem' }}>Durum</th>
                </tr>
              </thead>
              <tbody>
                {mockLisanslar.map((lisans) => (
                  <tr key={lisans.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a', fontFamily: 'monospace' }}>{lisans.id}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{lisans.software}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{lisans.dealer}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{lisans.expiry}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: lisans.status === 'Aktif' ? '#dcfce7' : lisans.status === 'Süresi Doldu' ? '#fee2e2' : '#fef9c3',
                        color: lisans.status === 'Aktif' ? '#166534' : lisans.status === 'Süresi Doldu' ? '#991b1b' : '#854d0e'
                      }}>
                        {lisans.status === 'Aktif' && <CheckCircle2 size={12} />}
                        {lisans.status === 'Süresi Doldu' && <XCircle size={12} />}
                        {lisans.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;

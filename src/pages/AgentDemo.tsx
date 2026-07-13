import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard, Server, Activity, MonitorSmartphone, Settings, Bot, Search, Bell, User, CheckCircle2, XCircle, AlertTriangle, Cpu, HardDrive, Wifi, Power } from 'lucide-react';
import { Link } from 'react-router-dom';

function DashboardView() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { title: 'Toplam Cihaz', value: '142', icon: <Server size={24} color="#3b82f6" />, bg: 'rgba(59, 130, 246, 0.1)' },
          { title: 'Çevrimiçi', value: '128', icon: <CheckCircle2 size={24} color="#10b981" />, bg: 'rgba(16, 185, 129, 0.1)' },
          { title: 'Çevrimdışı', value: '14', icon: <XCircle size={24} color="#ef4444" />, bg: 'rgba(239, 68, 68, 0.1)' },
          { title: 'Kritik Uyarılar', value: '3', icon: <AlertTriangle size={24} color="#f59e0b" />, bg: 'rgba(245, 158, 11, 0.1)' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: stat.bg, padding: '1rem', borderRadius: '0.75rem' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{stat.title}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155', minHeight: '300px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#e2e8f0' }}>Sistem Kaynak Kullanımı (Genel)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {['CPU Kullanımı', 'RAM Kullanımı', 'Disk G/Ç'].map((label, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <span>{label}</span>
                  <span>{Math.floor(Math.random() * 40) + 30}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.floor(Math.random() * 40) + 30}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
            <img src="/aiprojeler_Logo.png" alt="AI Projeler" style={{ width: '150px', filter: 'grayscale(100%)' }} />
          </div>
        </div>
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#e2e8f0' }}>Son Aktiviteler</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { text: 'DESKTOP-X92 ağına bağlandı', time: '2 dk önce', color: '#10b981' },
              { text: 'Sunucu-01 CPU uyarısı (89%)', time: '15 dk önce', color: '#f59e0b' },
              { text: 'LAPTOP-ERDAL bağlantı koptu', time: '1 saat önce', color: '#ef4444' },
              { text: 'Güncelleme paketi dağıtıldı', time: '3 saat önce', color: '#3b82f6' },
            ].map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.color, marginTop: '0.4rem' }}></div>
                <div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{act.text}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvanterView() {
  return (
    <div style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ background: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#e2e8f0', margin: 0 }}>Cihaz Envanteri</h3>
          <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>Yeni Cihaz Ekle</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #334155' }}>CİHAZ ADI</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #334155' }}>IP ADRESİ</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #334155' }}>İŞLETİM SİSTEMİ</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #334155' }}>DURUM</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, borderBottom: '1px solid #334155' }}>İŞLEM</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'DESKTOP-DEV01', ip: '192.168.1.104', os: 'Windows 11 Pro', status: 'Online' },
              { name: 'SRV-DATABASE', ip: '10.0.0.5', os: 'Windows Server 2022', status: 'Online' },
              { name: 'LAPTOP-MUDUR', ip: '192.168.1.55', os: 'Windows 10', status: 'Offline' },
              { name: 'DESKTOP-MUH01', ip: '192.168.1.112', os: 'Windows 10', status: 'Online' },
              { name: 'SRV-BACKUP', ip: '10.0.0.8', os: 'Linux Ubuntu 22.04', status: 'Online' },
            ].map((device, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '1rem 1.5rem', color: '#f8fafc', fontWeight: 500 }}>{device.name}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#cbd5e1', fontFamily: 'monospace' }}>{device.ip}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#cbd5e1' }}>{device.os}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.85rem', background: device.status === 'Online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: device.status === 'Online' ? '#10b981' : '#ef4444' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: device.status === 'Online' ? '#10b981' : '#ef4444' }}></div>
                    {device.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>Yönet</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TelemetriView() {
  return (
    <div style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { title: 'Ortalama İşlemci Sıcaklığı', value: '45°C', icon: <Cpu size={24} color="#ec4899" /> },
          { title: 'Ortalama RAM Tüketimi', value: '62%', icon: <HardDrive size={24} color="#8b5cf6" /> },
          { title: 'Ağ Trafiği (Anlık)', value: '1.2 GB/s', icon: <Wifi size={24} color="#06b6d4" /> }
        ].map((item, i) => (
          <div key={i} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem' }}>{item.icon}</div>
             <div>
               <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.title}</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{item.value}</div>
             </div>
          </div>
        ))}
      </div>
      
      <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '1rem', border: '1px solid #334155', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Activity size={64} color="#334155" style={{ marginBottom: '1rem' }} />
        <h3 style={{ color: '#94a3b8', margin: 0, fontWeight: 500 }}>Canlı Grafik Modülü Yükleniyor...</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>(Demo sürümünde grafik verileri simüle edilmektedir)</p>
      </div>
    </div>
  );
}

function UzakBaglantiView() {
  return (
    <div style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: '#f8fafc', margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>PC-STUDIO-{num}</h3>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MonitorSmartphone size={14} /> Kullanıcı Aktif</span>
              </div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
            </div>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
               <img src="/aiprojeler_Logo.png" style={{ width: '80px', opacity: 0.2 }} alt="Screen Preview" />
            </div>
            <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <MonitorSmartphone size={18} /> Bağlan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AyarlarView() {
  return (
    <div style={{ padding: '2rem', animation: 'fadeIn 0.3s ease', maxWidth: '800px' }}>
      <div style={{ background: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', padding: '2rem' }}>
        <h2 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '2rem', fontSize: '1.5rem' }}>Ajan Yapılandırması</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { title: 'Otomatik Güncelleme', desc: 'Ajan arka planda yeni sürümleri otomatik indirir.', active: true },
            { title: 'Telemetri Verisi Gönder', desc: 'CPU, RAM ve Disk sıcaklık verilerini ana sunucuya iletir.', active: true },
            { title: 'Sessiz Mod (Gizli Çalışma)', desc: 'Kullanıcı tepsisinde (tray icon) ajanı gizler.', active: false },
            { title: 'Uzak Bağlantı İzni', desc: 'Yöneticilerin cihaza VNC/RDP ile bağlanmasına izin verir.', active: true },
          ].map((setting, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i !== 3 ? '1.5rem' : 0, borderBottom: i !== 3 ? '1px solid #334155' : 'none' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{setting.title}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{setting.desc}</div>
              </div>
              <div style={{ width: '48px', height: '26px', background: setting.active ? '#3b82f6' : '#475569', borderRadius: '13px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '22px', height: '22px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: setting.active ? '24px' : '2px', transition: 'left 0.2s' }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Ayarları Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function AgentDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'envanter', icon: <Server size={20} />, label: 'Cihaz Envanteri' },
    { id: 'telemetri', icon: <Activity size={20} />, label: 'Canlı Telemetri' },
    { id: 'uzak', icon: <MonitorSmartphone size={20} />, label: 'Uzak Bağlantı' },
    { id: 'ayarlar', icon: <Settings size={20} />, label: 'Ajan Ayarları' },
  ];

  return (
    <>
      <Helmet>
        <title>Aİ Agent Konsolu | Demo</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '280px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #334155' }}>
            <div style={{ background: '#3b82f6', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Bot size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.05em' }}>Aİ AGENT</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Kurumsal Yönetim</div>
            </div>
          </div>

          <nav style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  background: activeTab === item.id ? '#3b82f6' : 'transparent',
                  color: activeTab === item.id ? '#fff' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          
          <div style={{ padding: '1.5rem', borderTop: '1px solid #334155' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              &larr; Ana Siteye Dön
            </Link>
          </div>
        </aside>

        {/* Main Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a', overflowY: 'auto' }}>
          
          {/* Header */}
          <header style={{ height: '73px', flexShrink: 0, borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: '#1e293b', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#0f172a', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid #334155', width: '300px' }}>
              <Search size={18} color="#64748b" />
              <input type="text" placeholder="Cihaz veya IP ara..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f8fafc', width: '100%' }} disabled />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <Power size={14} /> Sistem Aktif
              </div>
              <Bell size={20} color="#94a3b8" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #334155', paddingLeft: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Demo Kullanıcı</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Aİ Agent Admin</div>
                </div>
                <div style={{ background: '#334155', padding: '0.5rem', borderRadius: '50%' }}>
                  <User size={20} color="#cbd5e1" />
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Content */}
          <div style={{ flex: 1 }}>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'envanter' && <EnvanterView />}
            {activeTab === 'telemetri' && <TelemetriView />}
            {activeTab === 'uzak' && <UzakBaglantiView />}
            {activeTab === 'ayarlar' && <AyarlarView />}
          </div>

        </main>
      </div>
    </>
  );
}

export default AgentDemo;

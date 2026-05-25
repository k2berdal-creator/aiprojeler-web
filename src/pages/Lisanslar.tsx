import { useState, useEffect } from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../index.css';

interface Lisans {
  id: string;
  software: string;
  dealer: string;
  expiry: string;
  status: string;
}

function Lisanslar() {
  const [lisanslar, setLisanslar] = useState<Lisans[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'lisanslar'), (snapshot) => {
      const lisanslarData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lisans[];
      setLisanslar(lisanslarData);
    });
    return () => unsubscribe();
  }, []);

  const filteredLisanslar = lisanslar.filter(l => 
    l.software.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.dealer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Lisans Yönetimi</h1>
        <p style={{ color: '#64748b' }}>Müşterilerinize ait yazılım lisanslarını buradan takip edebilirsiniz.</p>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Yazılım veya Bayi Ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Yazılım</th>
                <th style={{ padding: '1rem' }}>Bayi / Müşteri</th>
                <th style={{ padding: '1rem' }}>Bitiş Tarihi</th>
                <th style={{ padding: '1rem' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredLisanslar.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Listelenecek lisans bulunamadı.</td></tr>
              ) : (
                filteredLisanslar.map((lisans) => (
                  <tr key={lisans.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a' }}>{lisans.software}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{lisans.dealer}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{lisans.expiry || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        background: lisans.status === 'Aktif' ? '#dcfce7' : '#fee2e2',
                        color: lisans.status === 'Aktif' ? '#166534' : '#991b1b'
                      }}>
                        {lisans.status === 'Aktif' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {lisans.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Lisanslar;

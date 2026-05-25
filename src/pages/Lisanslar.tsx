import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import '../index.css';

interface Lisans {
  id: string;
  software: string;
  licenseKey: string;
  dealer: string;
  expiry: string;
  status: string;
}

interface BayiOption {
  id: string;
  name: string;
}

function Lisanslar() {
  const [lisanslar, setLisanslar] = useState<Lisans[]>([]);
  const [bayiler, setBayiler] = useState<BayiOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [showAddLisans, setShowAddLisans] = useState(false);
  const [newSoftware, setNewSoftware] = useState('');
  const [newLicenseKey, setNewLicenseKey] = useState('');
  const [newDealer, setNewDealer] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  useEffect(() => {
    const unsubscribeLisanslar = onSnapshot(collection(db, 'lisanslar'), (snapshot) => {
      const lisanslarData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lisans[];
      setLisanslar(lisanslarData);
    });

    const unsubscribeBayiler = onSnapshot(collection(db, 'bayiler'), (snapshot) => {
      const bayilerData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      })) as BayiOption[];
      setBayiler(bayilerData);
    });

    return () => {
      unsubscribeLisanslar();
      unsubscribeBayiler();
    };
  }, []);

  const handleAddLisans = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSoftware || !newDealer || !newExpiry) return;
    
    try {
      await addDoc(collection(db, 'lisanslar'), {
        software: newSoftware,
        licenseKey: newLicenseKey,
        dealer: newDealer,
        expiry: newExpiry,
        status: 'Aktif',
        createdAt: serverTimestamp()
      });
      setShowAddLisans(false);
      setNewSoftware('');
      setNewLicenseKey('');
      setNewDealer('');
      setNewExpiry('');
    } catch (error) {
      console.error("Lisans eklenirken hata:", error);
      alert("Lisans eklenirken bir hata oluştu.");
    }
  };

  const filteredLisanslar = lisanslar.filter(l => 
    l.software.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.dealer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.licenseKey && l.licenseKey.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Lisans Yönetimi</h1>
        <p style={{ color: '#64748b' }}>Müşterilerinize ait yazılım lisanslarını buradan takip edebilirsiniz.</p>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Yazılım, Bayi veya Anahtar Ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
          </div>
          <button onClick={() => setShowAddLisans(!showAddLisans)} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
            <Plus size={16} /> Yeni Lisans Ekle
          </button>
        </div>

        {showAddLisans && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleAddLisans}
            style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', alignItems: 'flex-start', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
          >
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Yazılım Adı</label>
              <input type="text" className="form-input" value={newSoftware} onChange={e => setNewSoftware(e.target.value)} required />
            </div>
            
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Lisans Anahtarı</label>
              <input type="text" className="form-input" placeholder="Örn: XXXX-XXXX-XXXX-XXXX" value={newLicenseKey} onChange={e => setNewLicenseKey(e.target.value)} style={{ fontFamily: 'monospace' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Bayi / Müşteri Seçin</label>
              <select 
                className="form-input"
                value={newDealer} 
                onChange={e => setNewDealer(e.target.value)} 
                required
              >
                <option value="" disabled>Lütfen bir bayi seçin</option>
                {bayiler.map(bayi => (
                  <option key={bayi.id} value={bayi.name}>{bayi.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Bitiş Tarihi</label>
              <input type="date" className="form-input" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', justifySelf: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1rem' }}>Sisteme Kaydet</button>
            </div>
          </motion.form>
        )}
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Yazılım</th>
                <th style={{ padding: '1rem' }}>Lisans Anahtarı</th>
                <th style={{ padding: '1rem' }}>Bayi / Müşteri</th>
                <th style={{ padding: '1rem' }}>Bitiş Tarihi</th>
                <th style={{ padding: '1rem' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredLisanslar.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Listelenecek lisans bulunamadı.</td></tr>
              ) : (
                filteredLisanslar.map((lisans) => (
                  <tr key={lisans.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a' }}>{lisans.software}</td>
                    <td style={{ padding: '1rem', color: '#64748b', fontFamily: 'monospace' }}>{lisans.licenseKey || '-'}</td>
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

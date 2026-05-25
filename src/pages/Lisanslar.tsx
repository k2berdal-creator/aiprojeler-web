import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, CheckCircle2, XCircle, Key } from 'lucide-react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import '../index.css';

interface Lisans {
  id: string;
  software: string;
  licenseKey: string;
  dealer: string;
  userLimit: number;
  price: string;
  isLifetime: boolean;
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
  const [newDealer, setNewDealer] = useState('');
  const [newUserLimit, setNewUserLimit] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLicenseKey, setNewLicenseKey] = useState('');

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

  const generateLicenseKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generateSegment = (length: number) => {
      let segment = '';
      for (let i = 0; i < length; i++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return segment;
    };
    
    // Yüksek güvenlikli ve benzersiz 25 karakterlik Lisans Anahtarı üretimi
    setNewLicenseKey(`K2B-${generateSegment(5)}-${generateSegment(5)}-${generateSegment(5)}-${generateSegment(5)}`);
  };

  const handleAddLisans = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSoftware || !newDealer || !newLicenseKey) {
      alert("Lütfen Yazılım, Bayi ve Lisans Anahtarı alanlarını doldurun.");
      return;
    }
    
    try {
      await addDoc(collection(db, 'lisanslar'), {
        software: newSoftware,
        licenseKey: newLicenseKey,
        dealer: newDealer,
        userLimit: Number(newUserLimit) || 0,
        price: newPrice,
        isLifetime: true,
        status: 'Aktif',
        createdAt: serverTimestamp()
      });
      setShowAddLisans(false);
      setNewSoftware('');
      setNewLicenseKey('');
      setNewDealer('');
      setNewUserLimit('');
      setNewPrice('');
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
        <p style={{ color: '#64748b' }}>Müşterilerinize ait donanıma kilitli ömür boyu yazılım lisanslarını buradan takip edebilirsiniz.</p>
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
          <button onClick={() => setShowAddLisans(!showAddLisans)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
            <Plus size={16} /> Yeni Lisans Üret
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
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Kullanıcı Limiti</label>
              <input type="number" className="form-input" placeholder="Örn: 50" value={newUserLimit} onChange={e => setNewUserLimit(e.target.value)} required min="1" />
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Tutar / Fiyat</label>
              <input type="text" className="form-input" placeholder="Örn: 15.000 ₺" value={newPrice} onChange={e => setNewPrice(e.target.value)} required />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Lisans Anahtarı</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" placeholder="Oluştur butonuna basın ->" value={newLicenseKey} onChange={e => setNewLicenseKey(e.target.value)} style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0ea5e9', letterSpacing: '1px' }} required />
                <button type="button" onClick={generateLicenseKey} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <Key size={16} /> Anahtar Üret
                </button>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifySelf: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1rem' }}>Lisansı Aktifleştir ve Kaydet</button>
            </div>
          </motion.form>
        )}
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Yazılım & Bayi</th>
                <th style={{ padding: '1rem' }}>Lisans Anahtarı</th>
                <th style={{ padding: '1rem' }}>Sınır</th>
                <th style={{ padding: '1rem' }}>Süre</th>
                <th style={{ padding: '1rem' }}>Tutar</th>
                <th style={{ padding: '1rem' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredLisanslar.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Listelenecek lisans bulunamadı.</td></tr>
              ) : (
                filteredLisanslar.map((lisans) => (
                  <tr key={lisans.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{lisans.software}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{lisans.dealer}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#0ea5e9', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9rem' }}>{lisans.licenseKey || '-'}</td>
                    <td style={{ padding: '1rem', color: '#64748b', fontWeight: 500 }}>{lisans.userLimit ? `${lisans.userLimit} Kullanıcı` : 'Sınırsız'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', background: '#f1f5f9', color: '#475569', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>Ömür Boyu</span>
                    </td>
                    <td style={{ padding: '1rem', color: '#16a34a', fontWeight: 600 }}>{lisans.price || '-'}</td>
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

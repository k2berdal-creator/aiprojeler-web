import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import '../index.css';

interface Bayi {
  id: string;
  name: string;
  city: string;
  address: string;
  taxOffice: string;
  taxNumber: string;
  email: string;
  phone: string;
  status: string;
  clientCount: number;
}

function Bayiler() {
  const [bayiler, setBayiler] = useState<Bayi[]>([]);
  const [showAddBayi, setShowAddBayi] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form States
  const [newBayiName, setNewBayiName] = useState('');
  const [newBayiCity, setNewBayiCity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTaxOffice, setNewTaxOffice] = useState('');
  const [newTaxNumber, setNewTaxNumber] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'bayiler'), (snapshot) => {
      const bayilerData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bayi[];
      setBayiler(bayilerData);
    });
    return () => unsubscribe();
  }, []);

  const handleAddBayi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBayiName || !newBayiCity) return;
    try {
      await addDoc(collection(db, 'bayiler'), {
        name: newBayiName,
        city: newBayiCity,
        address: newAddress,
        taxOffice: newTaxOffice,
        taxNumber: newTaxNumber,
        email: newEmail,
        phone: newPhone,
        status: 'Aktif',
        clientCount: 0,
        createdAt: serverTimestamp()
      });
      setShowAddBayi(false);
      setNewBayiName('');
      setNewBayiCity('');
      setNewAddress('');
      setNewTaxOffice('');
      setNewTaxNumber('');
      setNewEmail('');
      setNewPhone('');
    } catch (error) {
      console.error("Bayi eklenirken hata:", error);
      alert("Bayi eklenirken bir hata oluştu.");
    }
  };

  const filteredBayiler = bayiler.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Bayi & Müşteri Yönetimi</h1>
        <p style={{ color: '#64748b' }}>Tüm bayilerinizi buradan yönetebilir ve yeni bayiler ekleyebilirsiniz.</p>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Bayi Ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
          </div>
          <button onClick={() => setShowAddBayi(!showAddBayi)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
            <Plus size={16} /> Yeni Bayi Ekle
          </button>
        </div>

        {showAddBayi && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleAddBayi}
            style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', alignItems: 'flex-start', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
          >
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Bayi / Şirket Adı</label>
              <input type="text" className="form-input" value={newBayiName} onChange={e => setNewBayiName(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Şehir</label>
              <input type="text" className="form-input" value={newBayiCity} onChange={e => setNewBayiCity(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>E-Posta Adresi</label>
              <input type="email" className="form-input" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="ornek@sirket.com" />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Telefon Numarası</label>
              <input type="tel" className="form-input" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="0555 555 55 55" />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Vergi Dairesi</label>
              <input type="text" className="form-input" value={newTaxOffice} onChange={e => setNewTaxOffice(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Vergi Numarası</label>
              <input type="text" className="form-input" value={newTaxNumber} onChange={e => setNewTaxNumber(e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Açık Adres</label>
              <textarea className="form-input" value={newAddress} onChange={e => setNewAddress(e.target.value)} style={{ minHeight: '80px', resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifySelf: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1rem' }}>Sisteme Kaydet</button>
            </div>
          </motion.form>
        )}
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Bayi Adı</th>
                <th style={{ padding: '1rem' }}>Şehir</th>
                <th style={{ padding: '1rem' }}>İletişim (Mail / Tel)</th>
                <th style={{ padding: '1rem' }}>Vergi Dairesi/No</th>
                <th style={{ padding: '1rem' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredBayiler.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Listelenecek bayi bulunamadı.</td></tr>
              ) : (
                filteredBayiler.map((bayi) => (
                  <tr key={bayi.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{bayi.name}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{bayi.city}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {bayi.email ? <span style={{fontSize: '0.85rem'}}>{bayi.email}</span> : null}
                        {bayi.phone ? <span style={{fontSize: '0.85rem', color: '#94a3b8'}}>{bayi.phone}</span> : null}
                        {!bayi.email && !bayi.phone && '-'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {(bayi.taxOffice || bayi.taxNumber) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                           <span style={{fontSize: '0.85rem'}}>{bayi.taxOffice || '-'}</span>
                           <span style={{fontSize: '0.85rem', fontFamily: 'monospace', color: '#94a3b8'}}>{bayi.taxNumber || '-'}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                        background: bayi.status === 'Aktif' ? '#dcfce7' : '#f1f5f9',
                        color: bayi.status === 'Aktif' ? '#166534' : '#475569'
                      }}>
                        {bayi.status}
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

export default Bayiler;

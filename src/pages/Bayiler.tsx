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
  status: string;
  clientCount: number;
}

function Bayiler() {
  const [bayiler, setBayiler] = useState<Bayi[]>([]);
  const [showAddBayi, setShowAddBayi] = useState(false);
  const [newBayiName, setNewBayiName] = useState('');
  const [newBayiCity, setNewBayiCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
        status: 'Aktif',
        clientCount: 0,
        createdAt: serverTimestamp()
      });
      setShowAddBayi(false);
      setNewBayiName('');
      setNewBayiCity('');
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
          <button onClick={() => setShowAddBayi(!showAddBayi)} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.875rem' }}>
            <Plus size={16} /> Yeni Bayi Ekle
          </button>
        </div>

        {showAddBayi && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleAddBayi}
            style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}
          >
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Bayi Adı</label>
              <input type="text" value={newBayiName} onChange={e => setNewBayiName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }} required />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Şehir</label>
              <input type="text" value={newBayiCity} onChange={e => setNewBayiCity(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }} required />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Kaydet</button>
          </motion.form>
        )}
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Bayi Adı</th>
                <th style={{ padding: '1rem' }}>Şehir</th>
                <th style={{ padding: '1rem' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredBayiler.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Listelenecek bayi bulunamadı.</td></tr>
              ) : (
                filteredBayiler.map((bayi) => (
                  <tr key={bayi.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: '#0f172a' }}>{bayi.name}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{bayi.city}</td>
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

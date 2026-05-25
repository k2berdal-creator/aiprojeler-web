import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../index.css';

interface Bayi {
  id: string;
  name: string;
  city: string;
  status: string;
  clientCount: number;
}

interface Lisans {
  id: string;
  software: string;
  dealer: string;
  expiry: string;
  status: string;
}

function Dashboard() {
  const [bayiler, setBayiler] = useState<Bayi[]>([]);
  const [lisanslar, setLisanslar] = useState<Lisans[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Bayileri Dinle (Real-time)
    const unsubscribeBayiler = onSnapshot(collection(db, 'bayiler'), (snapshot) => {
      const bayilerData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bayi[];
      setBayiler(bayilerData);
      setLoading(false);
    }, (error) => {
      console.error("Bayiler çekilirken hata:", error);
      setLoading(false);
    });

    // Lisansları Dinle (Real-time)
    const unsubscribeLisanslar = onSnapshot(collection(db, 'lisanslar'), (snapshot) => {
      const lisanslarData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lisans[];
      setLisanslar(lisanslarData);
    });

    return () => {
      unsubscribeBayiler();
      unsubscribeLisanslar();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Yönetim Özeti</h1>
        <p style={{ color: '#64748b' }}>Sistemdeki bayilerinizin ve lisanslarınızın canlı veritabanı özeti.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <motion.div className="glass-panel" style={{ padding: '1.5rem', background: '#fff' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Toplam Bayi</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{loading ? <Loader2 className="animate-spin" /> : bayiler.length}</p>
        </motion.div>
        <motion.div className="glass-panel" style={{ padding: '1.5rem', background: '#fff' }}>
          <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Kayıtlı Lisanslar</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary-color)' }}>{loading ? <Loader2 className="animate-spin" /> : lisanslar.length}</p>
        </motion.div>
      </div>

    </div>
  );
}

export default Dashboard;

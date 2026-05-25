import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp, Users, Key, Activity } from 'lucide-react';
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
  licenseKey: string;
  price: string;
  status: string;
  createdAt: any;
}

function Dashboard() {
  const [bayiler, setBayiler] = useState<Bayi[]>([]);
  const [lisanslar, setLisanslar] = useState<Lisans[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Bayileri Dinle
    const unsubscribeBayiler = onSnapshot(collection(db, 'bayiler'), (snapshot) => {
      const bayilerData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bayi[];
      setBayiler(bayilerData);
    });

    // Lisansları Dinle
    const unsubscribeLisanslar = onSnapshot(collection(db, 'lisanslar'), (snapshot) => {
      const lisanslarData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lisans[];
      // Tarihe göre sırala (en yeniden en eskiye)
      lisanslarData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setLisanslar(lisanslarData);
      setLoading(false);
    });

    return () => {
      unsubscribeBayiler();
      unsubscribeLisanslar();
    };
  }, []);

  // Toplam kazancı hesapla
  const calculateTotalRevenue = () => {
    let total = 0;
    lisanslar.forEach(l => {
      if (l.price) {
        // "15.000 ₺" veya "15000" gibi metinlerden sadece sayıları al
        const numericStr = l.price.replace(/[^0-9,]/g, '').replace(',', '.');
        const value = parseFloat(numericStr);
        if (!isNaN(value)) {
          total += value;
        }
      }
    });
    return total;
  };

  const totalRevenue = calculateTotalRevenue();
  const activeLicenses = lisanslar.filter(l => l.status === 'Aktif').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Finansal ve Operasyonel Rapor</h1>
        <p style={{ color: '#64748b' }}>Sistemdeki bayilerinizin, lisanslarınızın ve elde edilen gelirin canlı veritabanı özeti.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Toplam Kazanç Hacmi</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : `${totalRevenue.toLocaleString('tr-TR')} ₺`}
              </p>
            </div>
            <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '0.75rem', color: '#3b82f6' }}>
              <TrendingUp size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Aktif Lisanslar</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : activeLicenses}
              </p>
            </div>
            <div style={{ padding: '0.75rem', background: '#ecfdf5', borderRadius: '0.75rem', color: '#10b981' }}>
              <Activity size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Toplam Bayi / Müşteri</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : bayiler.length}
              </p>
            </div>
            <div style={{ padding: '0.75rem', background: '#f5f3ff', borderRadius: '0.75rem', color: '#8b5cf6' }}>
              <Users size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Toplam Üretilen Key</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : lisanslar.length}
              </p>
            </div>
            <div style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '0.75rem', color: '#f59e0b' }}>
              <Key size={24} />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Recent Licenses Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 700 }}>Son Üretilen Lisanslar</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Bayi</th>
                <th style={{ padding: '1rem' }}>Yazılım</th>
                <th style={{ padding: '1rem' }}>Lisans Anahtarı</th>
                <th style={{ padding: '1rem' }}>Tutar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /></td></tr>
              ) : lisanslar.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Henüz lisans üretilmedi.</td></tr>
              ) : (
                lisanslar.slice(0, 5).map((lisans) => (
                  <tr key={lisans.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{lisans.dealer}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{lisans.software}</td>
                    <td style={{ padding: '1rem', color: '#0ea5e9', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>{lisans.licenseKey}</td>
                    <td style={{ padding: '1rem', color: '#16a34a', fontWeight: 600 }}>{lisans.price || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}

export default Dashboard;

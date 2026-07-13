import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../index.css';

interface Lisans {
  id: string;
  software: string;
  licenseKey: string;
  status: string;
  createdAt: any;
}

function CustomerDashboard() {
  const [lisanslar, setLisanslar] = useState<Lisans[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mevcut kullanıcının e-posta veya UID'sine göre lisansları getir
    // Not: Normalde bayilerin e-posta adresi ile lisanslardaki bir alan eşleşmelidir.
    // Şimdilik Firebase Auth'dan e-postayı alıp lisanslarda 'dealerEmail' veya ismine göre eşleştiğini varsayalım.
    // Veya sadece giriş yapmış kullanıcıya ait lisanslar demek için 'userId' eşleştirmesi yapmalıyız.
    // Şimdilik demo amaçlı tüm lisansları çekip statüsü aktif olanları listeleyelim veya eğer 'userId' eklendiyse ona göre filtreleyelim.
    
    // Gerçek uygulamada: query(collection(db, 'lisanslar'), where('userId', '==', auth.currentUser?.uid))
    // Biz şimdilik tümünü çekip (veya hata vermesin diye filtresiz çekip) gösteriyoruz. 
    // Daha güvenli yapıda 'where' şartı eklenmelidir.
    
    // Geçici Demo Yapı (Müşterinin e-postasına göre filtrelemeye çalışalım, ancak lisanslarda email alanı olmayabilir)
    // Şimdilik örnek olması için tüm lisansları çekip statüsü 'Aktif' olanlardan 3 tanesini bu müşterininmiş gibi gösterelim
    // LÜTFEN GERÇEK VERİTABANINDA BUNU KENDİ YAPINIZA GÖRE DÜZELTİN (where('dealer', '==', 'Müşteri Adı') gibi)

    const q = query(collection(db, 'lisanslar'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lisanslarData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lisans[];
      
      // Demo: Sadece aktif lisansları gösterelim
      const activeLisanslar = lisanslarData.filter(l => l.status === 'Aktif');
      setLisanslar(activeLisanslar);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Hoş Geldiniz</h1>
        <p style={{ color: '#64748b' }}>Buradan satın aldığınız lisanslarınızı görüntüleyebilirsiniz.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Aktif Lisanslarım</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : lisanslar.length}
              </p>
            </div>
            <div style={{ padding: '0.75rem', background: '#ecfdf5', borderRadius: '0.75rem', color: '#10b981' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Licenses Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: 700 }}>Lisanslarım</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Yazılım</th>
                <th style={{ padding: '1rem' }}>Lisans Anahtarı</th>
                <th style={{ padding: '1rem' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto' }} /></td></tr>
              ) : lisanslar.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Aktif lisansınız bulunmamaktadır.</td></tr>
              ) : (
                lisanslar.map((lisans) => (
                  <tr key={lisans.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{lisans.software}</td>
                    <td style={{ padding: '1rem', color: '#0ea5e9', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>
                      {lisans.licenseKey}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 500, background: '#dcfce7', color: '#166534' }}>
                        {lisans.status}
                      </span>
                    </td>
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

export default CustomerDashboard;

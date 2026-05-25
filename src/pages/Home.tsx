import { motion } from 'framer-motion';
import { Bot, ArrowRight, ShieldCheck, Cloud, Clock, Shield, Users, Briefcase, Mail, Phone, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../index.css';

function Home() {
  return (
    <>
      {/* Background Effect */}
      <div className="bg-blobs-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="header-content glass-panel"
            style={{ borderRadius: '100px', padding: '0.75rem 1.5rem' }}
          >
            <div className="logo">
              <Bot className="gradient-text" style={{ color: 'var(--primary-color)' }} size={28} />
              <span style={{ fontWeight: 800 }}>AI Projeler</span>
            </div>
            <nav>
              <ul className="nav-links">
                <li><a href="#yazilimlarimiz">Yazılımlarımız</a></li>
                <li><a href="#neden-biz">Neden Biz?</a></li>
                <li><a href="#hakkimizda">Hakkımızda</a></li>
                <li><a href="#iletisim">İletişim</a></li>
              </ul>
            </nav>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>Müşteri Girişi</Link>
              <a href="#iletisim" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Bize Ulaşın</a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero container">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem', 
              borderRadius: '2rem',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
            className="glass-panel"
          >
            <ShieldCheck size={16} color="var(--secondary-color)" />
            <span className="gradient-text">Yüksek Güvenlikli Kurumsal Çözümler</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            İşletmenizi Büyütecek <br />
            <span className="gradient-text">CRM ve B2B</span> Yazılımları
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            AI Projeler olarak, firmanızın satış, pazarlama ve bayi ağını tek bir merkezden, tam güvenlikle yönetmenizi sağlayan ömür boyu lisanslı yazılımlar üretiyoruz.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a href="#yazilimlarimiz" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              Çözümleri İncele <ArrowRight size={18} />
            </a>
            <a href="#iletisim" className="btn-secondary" style={{ textDecoration: 'none' }}>Demo Talep Et</a>
          </motion.div>
        </section>

        {/* Yazılımlarımız Section */}
        <section id="yazilimlarimiz" className="container" style={{ padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Gelişmiş Yazılımlarımız</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tüm kurumsal süreçlerinizi dijitalleştirin ve otomatize edin.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '3rem' 
          }}>
            {/* CRM Kartı */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel" 
              style={{ padding: '3rem', transition: 'transform 0.3s' }}
              whileHover={{ y: -10 }}
            >
              <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: '#eff6ff', borderRadius: '1rem' }}>
                <Users size={40} color="#3b82f6" />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#0f172a' }}>Gelişmiş CRM Sistemi</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Müşteri ilişkilerinizi, satış süreçlerinizi ve personel performansınızı tek ekrandan yönetin. Müşterilerinizi asla kaybetmeyin, iletişim geçmişini anlık olarak kayıt altında tutun.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Detaylı Müşteri Profilleri</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Satış ve Fırsat Takibi</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Görev ve Takvim Yönetimi</li>
              </ul>
            </motion.div>

            {/* B2B Kartı */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel" 
              style={{ padding: '3rem', transition: 'transform 0.3s' }}
              whileHover={{ y: -10 }}
            >
              <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: '#f5f3ff', borderRadius: '1rem' }}>
                <Briefcase size={40} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#0f172a' }}>B2B Bayi Portalı</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Bayilerinizin veya toptan müşterilerinizin sisteme giriş yaparak sipariş verebileceği, cari hesaplarını takip edebileceği kapalı devre ticaret ağınızı kurun.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Özel Bayi Fiyatlandırmaları</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Sipariş ve Stok Entegrasyonu</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Cari Hesap ve Tahsilat</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Özellikler (Neden Biz) Section */}
        <section id="neden-biz" className="container" style={{ padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Neden AI Projeler?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Yazılımlarımızda standart olarak sunduğumuz eşsiz ayrıcalıklar.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { icon: <Lock size={32} color="#f59e0b" />, title: 'Donanıma Özel Güvenlik (HWID)', desc: 'Yazılımlarımız kurulduğu sunucunun donanım kimliğine kilitlenir. Asla kopyalanamaz veya başka cihaza taşınamaz.' },
              { icon: <Shield size={32} color="#10b981" />, title: 'Ömür Boyu Lisans', desc: 'Aylık veya yıllık kiralama bedelleri yok. Bir kez satın alın, ömür boyu sadece size ait olsun.' },
              { icon: <Cloud size={32} color="#3b82f6" />, title: 'Bulut Tabanlı Altyapı', desc: 'Sistemlerinize dünyanın her yerinden, tüm cihazlardan güvenle ve kesintisiz erişim sağlayın.' },
              { icon: <Clock size={32} color="#ec4899" />, title: '7/24 Kesintisiz Destek', desc: 'Olası bir sorunda teknik ekibimiz anında müdahale eder. İş süreçleriniz asla yarıda kalmaz.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel" 
                style={{ padding: '2rem', textAlign: 'center', transition: 'transform 0.3s' }}
                whileHover={{ y: -5 }}
              >
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, fontSize: '0.9rem' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* İletişim Section */}
        <section id="iletisim" className="container" style={{ padding: '5rem 2rem', marginBottom: '5rem' }}>
          <div className="glass-panel" style={{ padding: '3rem', borderRadius: '2rem', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>İletişime Geçin</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                CRM ve B2B yazılımlarımızla işinizi nasıl büyütebileceğimizi konuşmak için hemen bizimle iletişime geçin.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <a href="mailto:info@aiprojeler.com" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: '#0f172a' }}>
                  <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '50%', color: '#3b82f6' }}><Mail size={24} /></div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>E-Posta Adresimiz</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>info@aiprojeler.com</div>
                  </div>
                </a>
                
                <a href="https://wa.me/905366632474" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: '#0f172a' }}>
                  <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '50%', color: '#10b981' }}><Phone size={24} /></div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>WhatsApp & Telefon</div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>0536 663 24 74</div>
                  </div>
                </a>
              </div>
            </div>

            <div style={{ flex: '1 1 400px' }}>
              <form className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.7)' }} onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Adınız Soyadınız</label>
                  <input type="text" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#fff', outline: 'none' }} placeholder="Adınız" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Telefon Numaranız</label>
                  <input type="tel" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#fff', outline: 'none' }} placeholder="05XX XXX XX XX" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Mesajınız</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', resize: 'vertical' }} placeholder="CRM veya B2B yazılımı hakkında detaylı bilgi almak istiyorum..."></textarea>
                </div>
                <button className="btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', fontSize: '1rem' }}>Demo ve Bilgi Talebi Gönder</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.3)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bot size={20} color="var(--primary-color)" />
            <span style={{ fontWeight: 700, color: '#0f172a' }}>AI Projeler</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} AI Projeler Bilişim Teknolojileri. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;

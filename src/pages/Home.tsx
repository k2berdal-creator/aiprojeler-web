import { motion } from 'framer-motion';
import { Bot, ArrowRight, Sparkles, Cpu, Code2, HeadphonesIcon, Mail, Phone, MapPin } from 'lucide-react';
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
              <span>AI Projeler</span>
            </div>
            <nav>
              <ul className="nav-links">
                <li><a href="#cozumler">Çözümler</a></li>
                <li><a href="#hizmetler">Hizmetler</a></li>
                <li><a href="#referanslar">Referanslar</a></li>
                <li><a href="#hakkimizda">Hakkımızda</a></li>
              </ul>
            </nav>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a href="/login" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>Giriş Yap</a>
              <a href="#iletisim" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>İletişime Geç</a>
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
            <Sparkles size={16} color="var(--secondary-color)" />
            <span className="gradient-text">Geleceğin Teknolojisi Bugün İşletmenizde</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Özel Sektör İçin <br />
            <span className="gradient-text">Yapay Zeka Destekli</span> Çözümler
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            İş süreçlerinizi otonom hale getiren AI destekli CRM sistemleri, özel yazılım geliştirme ve uçtan uca teknik destek hizmetleriyle işinizi büyütüyoruz.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Çözümleri İncele <ArrowRight size={18} />
            </button>
            <button className="btn-secondary">Demo Talep Et</button>
          </motion.div>
        </section>

        {/* Çözümler Section */}
        <section id="cozumler" className="container" style={{ padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Yapay Zeka Çözümlerimiz</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>İşletmenizi geleceğe taşıyacak yapay zeka ürünlerimiz.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { icon: <Cpu size={32} color="var(--primary-color)" />, title: 'AI Destekli CRM', desc: 'Müşteri ilişkilerinizi yapay zeka ile otomatikleştirin, veri analizleriyle satışlarınızı katlayın.' },
              { icon: <Sparkles size={32} color="var(--secondary-color)" />, title: 'Özel Yapay Zeka Modelleri', desc: 'Sektörünüze ve ihtiyaçlarınıza özel eğitilmiş, otonom yapay zeka ajanları ve otomasyonlar.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel" 
                style={{ padding: '2rem', transition: 'transform 0.3s' }}
                whileHover={{ y: -10 }}
              >
                <div style={{ marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hizmetler Section */}
        <section id="hizmetler" className="container" style={{ padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Hizmetlerimiz</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Geleceğe hazır olmanız için gereken tüm teknolojik altyapı desteği.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { icon: <Code2 size={32} color="var(--primary-color)" />, title: 'Özel Yazılım Geliştirme', desc: 'İhtiyaçlarınıza özel, yüksek performanslı web, mobil ve masaüstü uygulamaları.' },
              { icon: <HeadphonesIcon size={32} color="var(--accent-color)" />, title: 'IT & Teknik Destek', desc: 'İşletmeniz için 7/24 teknik destek, sistem kurulumu ve altyapı yönetimi.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel" 
                style={{ padding: '2rem', transition: 'transform 0.3s' }}
                whileHover={{ y: -10 }}
              >
                <div style={{ marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Referanslar Section */}
        <section id="referanslar" className="container" style={{ padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Değerli İş Ortaklarımız</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Çözümlerimizle başarıya ulaşan markalar.</p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: item * 0.1 }}
                className="glass-panel"
                style={{
                  width: '180px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  color: 'var(--text-muted)'
                }}
              >
                Logo {item}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hakkımızda Section */}
        <section id="hakkimizda" className="container" style={{ padding: '5rem 2rem' }}>
          <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Biz Kimiz?</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '1rem' }}>
                Yapay zeka teknolojilerinin iş dünyasını nasıl dönüştürebileceğini çok iyi biliyoruz. Hedefimiz, kurumsal firmaların karmaşık süreçlerini otonom sistemlerle basitleştirerek verimliliği artırmaktır.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                Uzman ekibimizle, uçtan uca AI destekli CRM çözümleri ve özel yazılım projeleri geliştirerek, işletmenizi geleceğe hazırlıyoruz.
              </p>
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                width: '100%', 
                height: '300px', 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                borderRadius: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)'
              }}>
                <Bot size={100} color="var(--primary-color)" style={{ opacity: 0.8 }} />
              </div>
            </div>
          </div>
        </section>

        {/* İletişim Section */}
        <section id="iletisim" className="container" style={{ padding: '5rem 2rem', marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>İletişime Geçin</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Projeleriniz ve AI çözümleri için bizimle tanışın.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* İletişim Bilgileri */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: <Mail color="var(--primary-color)" />, text: 'info@aiprojeler.com' },
                { icon: <Phone color="var(--secondary-color)" />, text: '+90 (500) 000 00 00' },
                { icon: <MapPin color="var(--accent-color)" />, text: 'Teknoloji Geliştirme Bölgesi, İstanbul' }
              ].map((item, i) => (
                <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {item.icon}
                  <span style={{ fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* İletişim Formu */}
            <form className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={(e) => e.preventDefault()}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Adınız Soyadınız</label>
                <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} placeholder="Adınız" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>E-posta Adresiniz</label>
                <input type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none' }} placeholder="ornek@sirket.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Mesajınız</label>
                <textarea rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', resize: 'vertical' }} placeholder="Size nasıl yardımcı olabiliriz?"></textarea>
              </div>
              <button className="btn-primary" style={{ marginTop: '0.5rem' }}>Mesaj Gönder</button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.3)' }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} AI Projeler. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;

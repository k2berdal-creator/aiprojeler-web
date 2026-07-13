import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Bot, ArrowRight, ShieldCheck, Cloud, Clock, Shield, Users, Briefcase, Mail, Phone, Lock, Loader2, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { Project } from './ProjelerYonetimi';
import '../index.css';

export interface DynamicSection {
  id: string;
  type: 'text_image' | 'gallery';
  position: 'top' | 'middle' | 'bottom';
  title: string;
  description?: string;
  images: string[];
  isActive: boolean;
  order: number;
}

interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  videos: { id: string; url: string; title: string }[];
  dynamicSections?: DynamicSection[];
}

const DEFAULT_CONTENT: HomePageContent = {
  heroTitle: 'Yüksek Güvenlikli Kurumsal Çözümler',
  heroSubtitle: 'İşletmenizi Büyütecek CRM ve B2B Yazılımları',
  heroDescription: 'AI Projeler olarak, firmanızın satış, pazarlama ve bayi ağını tek bir merkezden, tam güvenlikle yönetmenizi sağlayan ömür boyu lisanslı yazılımlar üretiyoruz.',
  aboutTitle: 'Gelişmiş Yazılımlarımız',
  aboutDescription: 'Tüm kurumsal süreçlerinizi dijitalleştirin ve otomatize edin.',
  videos: [],
  dynamicSections: []
};

function Home() {
  const [content, setContent] = useState<HomePageContent>(DEFAULT_CONTENT);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'site_content', 'home');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent({ ...DEFAULT_CONTENT, ...docSnap.data() } as HomePageContent);
        }

        // Projeleri getir
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projs: Project[] = [];
        querySnapshot.forEach((d) => {
          projs.push({ id: d.id, ...d.data() } as Project);
        });
        projs.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(projs);

      } catch (error) {
        console.error("İçerik yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Dinamik bölümleri konuma göre render eden yardımcı fonksiyon
  const renderDynamicSections = (position: 'top' | 'middle' | 'bottom') => {
    const sections = content.dynamicSections?.filter(s => s.isActive && (s.position || 'middle') === position) || [];
    if (sections.length === 0) return null;

    return (
      <div className={`dynamic-sections-wrapper-${position}`}>
        {sections.sort((a, b) => a.order - b.order).map((section, i) => (
          <section key={section.id} className="container" style={{ padding: '5rem 2rem' }}>
            
            {/* Text & Image Section Type */}
            {section.type === 'text_image' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                <motion.div 
                  initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{ flex: '1 1 400px' }}
                >
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>{section.title}</h2>
                  <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{section.description}</p>
                </motion.div>
                
                {section.images && section.images.length > 0 && (
                  <motion.div 
                    initial={{ x: i % 2 === 0 ? 50 : -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ flex: '1 1 400px' }}
                  >
                    <div className="glass-panel" style={{ padding: '1rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.5)' }}>
                      <img src={section.images[0]} alt={section.title} style={{ width: '100%', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Gallery Section Type */}
            {section.type === 'gallery' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{section.title}</h2>
                  {section.description && <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{section.description}</p>}
                </div>
                
                {section.images && section.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {section.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="glass-panel"
                        style={{ overflow: 'hidden', padding: 0, borderRadius: '1.5rem', height: '250px' }}
                      >
                        <img src={img} alt={`${section.title} ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{content.heroTitle ? `${content.heroTitle} | AI Projeler` : 'AI Projeler | Kurumsal CRM ve B2B Çözümleri'}</title>
        <meta name="description" content={content.heroDescription || 'İşletmenizi büyütecek, satış ve bayi ağınızı tek bir merkezden yöneteceğiniz ömür boyu lisanslı yazılımlar.'} />
        <meta property="og:title" content={content.heroTitle ? `${content.heroTitle} | AI Projeler` : 'AI Projeler | Kurumsal CRM ve B2B Çözümleri'} />
        <meta property="og:description" content={content.heroDescription || 'İşletmenizi büyütecek, satış ve bayi ağınızı tek bir merkezden yöneteceğiniz ömür boyu lisanslı yazılımlar.'} />
      </Helmet>

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
            style={{ borderRadius: '100px', padding: '0.75rem 1.5rem', position: 'relative' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div className="logo">
                <Bot className="gradient-text" style={{ color: 'var(--primary-color)' }} size={28} />
                <span style={{ fontWeight: 800 }}>AI Projeler</span>
              </div>
              <button 
                className="mobile-menu-btn" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {isMobileMenuOpen ? <X size={24} color="var(--text-color)" /> : <Menu size={24} color="var(--text-color)" />}
              </button>
            </div>

            <div className={`nav-container ${isMobileMenuOpen ? 'open' : ''}`}>
              <nav>
                <ul className="nav-links">
                  <li><a href="#yazilimlarimiz" onClick={() => setIsMobileMenuOpen(false)}>Yazılımlarımız</a></li>
                  {projects && projects.length > 0 && (
                    <li><a href="#projeler" onClick={() => setIsMobileMenuOpen(false)}>Projelerimiz</a></li>
                  )}
                  {content.videos && content.videos.length > 0 && (
                    <li><a href="#videolar" onClick={() => setIsMobileMenuOpen(false)}>Videolar</a></li>
                  )}
                  <li><a href="#neden-biz" onClick={() => setIsMobileMenuOpen(false)}>Neden Biz?</a></li>
                  <li><a href="#iletisim" onClick={() => setIsMobileMenuOpen(false)}>İletişim</a></li>
                </ul>
              </nav>
              <div className="header-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>Müşteri Girişi</Link>
                <a href="#iletisim" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Bize Ulaşın</a>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
              <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
            </div>
          ) : (
            <>
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
                <span className="gradient-text">{content.heroTitle}</span>
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                dangerouslySetInnerHTML={{ __html: content.heroSubtitle }}
              />

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {content.heroDescription}
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
            </>
          )}
        </section>

        {/* TOP POSITION DYNAMIC SECTIONS */}
        {renderDynamicSections('top')}

        {/* Yazılımlarımız Section */}
        <section id="yazilimlarimiz" className="container" style={{ padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{content.aboutTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{content.aboutDescription}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
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
                Müşteri ilişkilerinizi, satış süreçlerinizi ve personel performansınızı tek ekrandan yönetin.
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
                Bayilerinizin sisteme giriş yaparak sipariş verebileceği ticaret ağınızı kurun.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#475569' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Özel Bayi Fiyatlandırmaları</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Sipariş ve Stok Entegrasyonu</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} color="#10b981" /> Cari Hesap ve Tahsilat</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Projeler Section */}
        {projects && projects.length > 0 && (
          <section id="projeler" className="container" style={{ padding: '5rem 2rem', background: 'rgba(255,255,255,0.4)', borderRadius: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sistemlerimiz ve Projelerimiz</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Geliştirdiğimiz tüm kurumsal yazılımları ve canlı demoları inceleyin.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
              {projects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-panel" 
                  style={{ overflow: 'hidden', padding: 0, borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', background: '#fff', transition: 'transform 0.3s' }}
                  whileHover={{ y: -10 }}
                >
                  <div style={{ height: '220px', background: '#f1f5f9', position: 'relative' }}>
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Görsel Yok</div>
                    )}
                    {project.demoUrl && (
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(16, 185, 129, 0.9)', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ShieldCheck size={14} /> Demo Aktif
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>{(project.description || '').substring(0, 150)}...</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <Link to={`/proje/${project.id}`} className="btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', width: '100%', textAlign: 'center', borderRadius: '0.75rem' }}>
                        Projeyi İncele
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* MIDDLE POSITION DYNAMIC SECTIONS */}
        {renderDynamicSections('middle')}

        {/* Videolar Section */}
        {content.videos && content.videos.length > 0 && (
          <section id="videolar" className="container" style={{ padding: '5rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sistem Tanıtımları</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Yazılımlarımızın nasıl çalıştığını videolarımızdan izleyin.</p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '2rem' 
            }}>
              {content.videos.map((video, i) => (
                <motion.div 
                  key={video.id}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-panel" 
                  style={{ overflow: 'hidden', padding: 0, borderRadius: '1rem' }}
                >
                  {/* Responsive Iframe Container */}
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
                    <iframe
                      src={video.url}
                      title={video.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div style={{ padding: '1rem 1.5rem', background: '#fff' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a' }}>{video.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM POSITION DYNAMIC SECTIONS */}
        {renderDynamicSections('bottom')}

        {/* Özellikler (Neden Biz) Section */}
        <section id="neden-biz" className="container" style={{ padding: '5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Neden AI Projeler?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Yazılımlarımızda standart olarak sunduğumuz eşsiz ayrıcalıklar.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Lock size={32} color="#f59e0b" />, title: 'Donanıma Özel Güvenlik', desc: 'Yazılımlarımız kurulduğu sunucunun donanım kimliğine kilitlenir. Asla kopyalanamaz veya başka cihaza taşınamaz.' },
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

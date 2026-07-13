import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, ShieldCheck, Link as LinkIcon, Key, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project } from './ProjelerYonetimi';
import '../index.css';

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          // Proje bulunamadı
          navigate('/');
        }
      } catch (error) {
        console.error("Proje yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <>
      <Helmet>
        <title>{project.title} | AI Projeler</title>
        <meta name="description" content={(project.description || '').substring(0, 160)} />
      </Helmet>

      <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem' }}>
        {/* Header Bar */}
        <header style={{ background: '#fff', padding: '1rem 0', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
              <ArrowLeft size={20} /> Ana Sayfaya Dön
            </Link>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{project.title}</div>
          </div>
        </header>

        <div className="container" style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Hero / Cover */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel" style={{ padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '1.5rem', display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 400px', height: '400px', background: '#f1f5f9' }}>
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <ImageIcon size={64} />
                  </div>
                )}
              </div>
              
              <div style={{ flex: '1 1 400px', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.2 }}>{project.title}</h1>
                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {project.description}
                </p>
                
                {project.demoUrl && (
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                      <LinkIcon size={18} /> Canlı Demo
                    </h3>
                    {project.demoCredentials && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem', background: '#e0e7ff', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: '#4338ca' }}>
                        <Key size={16} /> <span>Giriş Bilgileri: <strong>{project.demoCredentials}</strong></span>
                      </div>
                    )}
                    {(() => {
                      const isInternal = !project.demoUrl.startsWith('http') && !project.demoUrl.includes('.');
                      const internalPath = project.demoUrl.startsWith('/') ? project.demoUrl : `/${project.demoUrl}`;
                      const demoHref = isInternal 
                        ? internalPath 
                        : (project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`);
                      
                      if (isInternal) {
                        return (
                          <Link to={internalPath} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                            Demoyu Başlat <ArrowLeft size={18} style={{ transform: 'rotate(135deg)' }} />
                          </Link>
                        );
                      }
                      
                      return (
                        <a href={demoHref} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                          Demoyu Başlat <ArrowLeft size={18} style={{ transform: 'rotate(135deg)' }} />
                        </a>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              
              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ flex: '1 1 300px' }} className="glass-panel">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>Öne Çıkan Özellikler</h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {project.features.map((feature, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1.05rem', color: '#334155' }}>
                        <ShieldCheck size={24} color="var(--secondary-color)" style={{ flexShrink: 0 }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Videolar */}
              {((project.videoUrls && project.videoUrls.length > 0) || project.videoUrl) && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="glass-panel">
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>Tanıtım Videoları</h2>
                  
                  {/* Yeni çoklu video desteği */}
                  {project.videoUrls?.map((url, index) => (
                    <div key={index} style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '1rem', overflow: 'hidden' }}>
                      <iframe
                        src={url}
                        title={`${project.title} Video ${index + 1}`}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}

                  {/* Geriye dönük uyumluluk: Eğer sadece eski videoUrl varsa ve videoUrls boşsa */}
                  {project.videoUrl && !(project.videoUrls?.length) && (
                    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: '1rem', overflow: 'hidden' }}>
                      <iframe
                        src={project.videoUrl}
                        title={`${project.title} Video`}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Galeri */}
            {project.images && project.images.length > 0 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#0f172a', textAlign: 'center' }}>Ekran Görüntüleri</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {project.images.map((img, i) => (
                    <div key={i} style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                      <img src={img} alt={`${project.title} Ekran Görüntüsü ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectDetail;

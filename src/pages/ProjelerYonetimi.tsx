import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Edit, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import '../index.css';

export interface Project {
  id: string;
  title: string;
  description: string;
  features: string[];
  demoUrl: string;
  demoCredentials?: string;
  coverImage: string;
  images: string[];
  videoUrl?: string; // YouTube embed link vs. (Eski)
  videoUrls?: string[]; // Çoklu video linkleri
  order: number;
}

function ProjelerYonetimi() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [featureInput, setFeatureInput] = useState('');

  // Firebase Storage kısıtlamalarına karşı URL seçeneği
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProjects();
    const autoUpdate = async () => {
      if (localStorage.getItem('auto_updated_projects')) return;
      try {
        const snapshot = await getDocs(collection(db, 'projects'));
        const updatePromises = snapshot.docs.map(docSnap => {
          return setDoc(doc(db, 'projects', docSnap.id), {
            coverImage: '/aiprojeler_Banner.png',
            images: ['/aiprojeler_Logo.png']
          }, { merge: true });
        });
        await Promise.all(updatePromises);
        localStorage.setItem('auto_updated_projects', 'true');
        alert("Tüm projelere banner ve logo otomatik olarak uygulandı!");
        fetchProjects();
      } catch (err) {
        console.error(err);
      }
    };
    autoUpdate();

    // K2B Agent Projesini Otomatik Ekle
    const addK2BAgentProject = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        let exists = false;
        querySnapshot.forEach(doc => {
          if (doc.data().title === 'K2B Destek ve Envanter Ajanı') {
            exists = true;
          }
        });

        if (!exists) {
          await setDoc(doc(db, 'projects', 'k2b-agent-project'), {
            title: 'K2B Destek ve Envanter Ajanı',
            description: 'Müşterilerinize 7/24 kesintisiz destek sunmanızı, cihaz envanterini anlık olarak takip etmenizi ve tüm IT süreçlerini tek merkezden yönetmenizi sağlayan, sıfır kurulum gerektiren uzak destek aracı.',
            features: [
              'Anlık Telemetri (CPU, RAM, Disk, Network)',
              'Otomatik Sorun Tespiti ve Ticket Oluşturma',
              'Tek Tıkla Uzak Bağlantı (Remote Shell/Desktop)',
              'Güvenli Müşteri Kimliklendirme (Firm Code)',
              'Log-off Çalışma Desteği'
            ],
            demoUrl: '/agent-demo',
            demoCredentials: '',
            coverImage: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bot.svg', 
            images: [],
            order: 0
          });
          console.log('K2B Agent projesi başarıyla eklendi.');
          fetchProjects();
        }
      } catch (err) {
        console.error('K2B Agent eklenirken hata oluştu', err);
      }
    };
    addK2BAgentProject();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projs: Project[] = [];
      querySnapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });
      // Sıralamaya göre dizelim
      projs.sort((a, b) => (a.order || 0) - (b.order || 0));
      setProjects(projs);
    } catch (error) {
      console.error("Projeler yüklenemedi:", error);
      setMessage("Projeler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async () => {
    if (!currentProject.title) {
      setMessage("Hata: Proje başlığı zorunludur.");
      return;
    }
    
    setSaving(true);
    setMessage('');
    try {
      const projectId = currentProject.id || Date.now().toString();
      const projectData = {
        ...currentProject,
        id: projectId,
        features: currentProject.features || [],
        images: currentProject.images || [],
        order: currentProject.order || projects.length
      };

      await setDoc(doc(db, 'projects', projectId), projectData);
      
      setMessage('Proje başarıyla kaydedildi!');
      setIsEditing(false);
      setCurrentProject({});
      fetchProjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      setMessage('Hata: Kaydedilirken bir problem oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
      setMessage("Proje silindi.");
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Silme hatası:", error);
      setMessage("Hata: Silinirken bir problem oluştu.");
    }
  };

  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    
    let embedUrl = videoUrlInput.trim();
    if (embedUrl.includes('youtube.com/watch?v=')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    setCurrentProject(prev => ({
      ...prev,
      videoUrls: [...(prev.videoUrls || []), embedUrl]
    }));
    setVideoUrlInput('');
  };

  const handleRemoveVideoUrl = (index: number) => {
    setCurrentProject(prev => ({
      ...prev,
      videoUrls: prev.videoUrls?.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setCurrentProject(prev => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setCurrentProject(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    
    if (!currentProject.coverImage) {
      setCurrentProject(prev => ({ ...prev, coverImage: imageUrlInput.trim() }));
    } else {
      setCurrentProject(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrlInput.trim()]
      }));
    }
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (örn. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Hata: Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (!currentProject.coverImage) {
        setCurrentProject(prev => ({ ...prev, coverImage: url }));
      } else {
        setCurrentProject(prev => ({
          ...prev,
          images: [...(prev.images || []), url]
        }));
      }
    } catch (error) {
      console.error("Yükleme hatası:", error);
      setMessage("Hata: Görsel yüklenemedi. (Storage izinlerini veya kotalarını kontrol edin)");
    } finally {
      setUploadingImage(false);
      // Input'u sıfırla
      e.target.value = '';
    }
  };

  const handleRemoveImage = (url: string, isCover: boolean = false) => {
    if (isCover) {
      setCurrentProject(prev => ({ ...prev, coverImage: '' }));
    } else {
      setCurrentProject(prev => ({
        ...prev,
        images: prev.images?.filter(img => img !== url)
      }));
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>Projeler Yönetimi</h1>
          <p style={{ color: '#64748b' }}>Geliştirdiğiniz projeleri ve demoları buradan yönetebilirsiniz.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setCurrentProject({}); setIsEditing(true); }} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} /> Yeni Proje Ekle
          </button>
        )}
      </header>

      {message && (
        <div style={{ padding: '1rem', background: message.includes('Hata') ? '#fee2e2' : '#dcfce7', color: message.includes('Hata') ? '#991b1b' : '#166534', borderRadius: '0.5rem' }}>
          {message}
        </div>
      )}

      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2rem', background: '#fff' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            {currentProject.id ? 'Projeyi Düzenle' : 'Yeni Proje'}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Proje Adı</label>
              <input type="text" value={currentProject.title || ''} onChange={e => setCurrentProject(p => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Örn: Gelişmiş CRM Çözümü" />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Açıklama</label>
              <textarea value={currentProject.description || ''} onChange={e => setCurrentProject(p => ({ ...p, description: e.target.value }))} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Projenin detaylı açıklaması..." />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Demo URL (Örn: https://crm.aiprojeler.com)</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRight: '1px solid #cbd5e1' }}><LinkIcon size={18} color="#64748b" /></div>
                <input type="text" value={currentProject.demoUrl || ''} onChange={e => setCurrentProject(p => ({ ...p, demoUrl: e.target.value }))} style={{ width: '100%', padding: '0.75rem', border: 'none', outline: 'none' }} placeholder="https://" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Demo Giriş Bilgileri (Opsiyonel)</label>
              <input type="text" value={currentProject.demoCredentials || ''} onChange={e => setCurrentProject(p => ({ ...p, demoCredentials: e.target.value }))} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="K.Adı: admin / Şifre: 123456" />
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tanıtım Videoları (YouTube Linki veya Embed)</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="text" value={videoUrlInput} onChange={e => setVideoUrlInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddVideoUrl()} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Örn: https://www.youtube.com/watch?v=..." />
                <button onClick={handleAddVideoUrl} style={{ padding: '0 1rem', background: '#0f172a', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Ekle</button>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, listStyle: 'none' }}>
                {currentProject.videoUrls?.map((url, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '0.5rem' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                    <button onClick={() => handleRemoveVideoUrl(i)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </li>
                ))}
                {/* Geriye dönük uyumluluk için eski videoUrl varsa */}
                {currentProject.videoUrl && !(currentProject.videoUrls?.length) && (
                  <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '0.5rem' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentProject.videoUrl} (Eski)</span>
                    <button onClick={() => setCurrentProject(p => ({ ...p, videoUrl: '' }))} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </li>
                )}
              </ul>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Öne Çıkan Özellikler</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddFeature()} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Örn: Bulut tabanlı yedekleme" />
                <button onClick={handleAddFeature} style={{ padding: '0 1rem', background: '#0f172a', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Ekle</button>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, listStyle: 'none' }}>
                {currentProject.features?.map((f, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '0.5rem' }}>
                    <span>{f}</span>
                    <button onClick={() => handleRemoveFeature(i)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, fontSize: '1.1rem' }}>Proje Görselleri</label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>URL ile Görsel Ekle (Alan tasarrufu için önerilir)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="https://..." />
                    <button onClick={handleAddImageUrl} style={{ padding: '0 1rem', background: '#0f172a', color: '#fff', borderRadius: '0.5rem', border: 'none' }}>Ekle</button>
                  </div>
                </div>
                
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Veya Dosya Yükle (Max 5MB)</label>
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploadingImage} style={{ padding: '0.5rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #cbd5e1', width: '100%' }} />
                  {uploadingImage && <span style={{ fontSize: '0.8rem', color: '#2563eb', marginTop: '0.2rem' }}>Yükleniyor...</span>}
                </div>
              </div>

              {/* Görsel Önizlemeleri */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {currentProject.coverImage && (
                  <div style={{ position: 'relative', width: '150px', height: '100px', borderRadius: '0.5rem', overflow: 'hidden', border: '2px solid #3b82f6' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, background: '#3b82f6', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderBottomRightRadius: '0.5rem' }}>Kapak</div>
                    <img src={currentProject.coverImage} alt="Kapak" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => handleRemoveImage(currentProject.coverImage!, true)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={12} /></button>
                  </div>
                )}
                
                {currentProject.images?.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '150px', height: '100px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    <img src={img} alt={`Görsel ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => handleRemoveImage(img)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={() => setIsEditing(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>İptal</button>
            <button onClick={handleSaveProject} disabled={saving} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}>
              <Save size={18} /> {saving ? 'Kaydediliyor...' : 'Projeyi Kaydet'}
            </button>
          </div>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.length === 0 ? (
            <p style={{ color: '#64748b' }}>Henüz hiç proje eklenmemiş.</p>
          ) : (
            projects.map(project => (
              <div key={project.id} className="glass-panel" style={{ background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', background: '#f1f5f9', position: 'relative' }}>
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', flex: 1 }}>{(project.description || '').substring(0, 100)}...</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    {project.demoUrl ? (
                      (() => {
                        const isInternal = !project.demoUrl.startsWith('http') && !project.demoUrl.includes('.');
                        const internalPath = project.demoUrl.startsWith('/') ? project.demoUrl : `/${project.demoUrl}`;
                        const demoHref = isInternal 
                          ? internalPath 
                          : (project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`);
                        
                        return (
                          <a href={demoHref} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                            <LinkIcon size={14} /> Demo Aktif
                          </a>
                        );
                      })()
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Demo Yok</span>
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => { setCurrentProject(project); setIsEditing(true); }} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1', background: '#fff', color: '#3b82f6', cursor: 'pointer' }}><Edit size={16} /></button>
                      <button onClick={() => handleDeleteProject(project.id)} style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #fee2e2', background: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProjelerYonetimi;

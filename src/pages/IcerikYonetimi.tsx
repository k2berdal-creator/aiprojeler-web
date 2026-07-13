import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Video, Type, LayoutTemplate, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
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

export interface HomePageContent {
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

function IcerikYonetimi() {
  const [activeTab, setActiveTab] = useState<'text' | 'video' | 'sections'>('text');
  const [content, setContent] = useState<HomePageContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Yeni video formu
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const docRef = doc(db, 'site_content', 'home');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as HomePageContent;
        if (!data.dynamicSections) data.dynamicSections = [];
        setContent({ ...DEFAULT_CONTENT, ...data });
      } else {
        await setDoc(docRef, DEFAULT_CONTENT);
        setContent(DEFAULT_CONTENT);
      }
    } catch (error) {
      console.error("İçerik yüklenemedi:", error);
      setMessage("İçerik yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const docRef = doc(db, 'site_content', 'home');
      // dynamicSections arrayini siparişe göre sıralayalım
      const sortedContent = {
        ...content,
        dynamicSections: [...(content.dynamicSections || [])].sort((a, b) => a.order - b.order)
      };
      await setDoc(docRef, sortedContent);
      setContent(sortedContent);
      setMessage('Değişiklikler başarıyla kaydedildi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      setMessage('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    let embedUrl = newVideoUrl;
    if (newVideoUrl.includes('youtube.com/watch?v=')) {
      const videoId = newVideoUrl.split('v=')[1]?.split('&')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (newVideoUrl.includes('youtu.be/')) {
      const videoId = newVideoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    const newVideo = { id: Date.now().toString(), url: embedUrl, title: newVideoTitle || 'İsimsiz Video' };
    setContent(prev => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
    setNewVideoUrl(''); setNewVideoTitle('');
  };

  const handleRemoveVideo = (id: string) => {
    setContent(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
  };

  // --- DİNAMİK BÖLÜM YÖNETİMİ METOTLARI ---

  const handleAddSection = (type: 'text_image' | 'gallery') => {
    const newSection: DynamicSection = {
      id: Date.now().toString(),
      type,
      position: 'middle',
      title: type === 'text_image' ? 'Yeni Bilgilendirme Alanı' : 'Yeni Görsel Galeri',
      description: type === 'text_image' ? 'Bu alana detaylı açıklamanızı yazabilirsiniz...' : '',
      images: [],
      isActive: true,
      order: (content.dynamicSections?.length || 0) + 1
    };
    setContent(prev => ({
      ...prev,
      dynamicSections: [...(prev.dynamicSections || []), newSection]
    }));
  };

  const handleUpdateSection = (id: string, field: keyof DynamicSection, value: any) => {
    setContent(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections?.map(sec => 
        sec.id === id ? { ...sec, [field]: value } : sec
      )
    }));
  };

  const handleRemoveSection = (id: string) => {
    if(!window.confirm("Bu bölümü silmek istediğinize emin misiniz? (Yayından kaldırmak için Aktif anahtarını kapatabilirsiniz)")) return;
    setContent(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections?.filter(sec => sec.id !== id)
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...(content.dynamicSections || [])];
    if (direction === 'up' && index > 0) {
      [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [sections[index + 1], sections[index]] = [sections[index], sections[index + 1]];
    }
    // Update orders
    sections.forEach((sec, i) => sec.order = i);
    setContent(prev => ({ ...prev, dynamicSections: sections }));
  };

  const handleAddImageToSection = (sectionId: string, url: string) => {
    if(!url.trim()) return;
    setContent(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections?.map(sec => 
        sec.id === sectionId ? { ...sec, images: [...sec.images, url.trim()] } : sec
      )
    }));
  };

  const handleRemoveImageFromSection = (sectionId: string, imgIndex: number) => {
    setContent(prev => ({
      ...prev,
      dynamicSections: prev.dynamicSections?.map(sec => 
        sec.id === sectionId ? { ...sec, images: sec.images.filter((_, i) => i !== imgIndex) } : sec
      )
    }));
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0f172a', marginBottom: '0.5rem' }}>İçerik Yönetimi</h1>
          <p style={{ color: '#64748b' }}>Ana sayfa metinlerini, videolarını ve ilave bölümlerini buradan düzenleyebilirsiniz.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={20} /> {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </header>

      {message && (
        <div style={{ padding: '1rem', background: message.includes('hata') ? '#fee2e2' : '#dcfce7', color: message.includes('hata') ? '#991b1b' : '#166534', borderRadius: '0.5rem' }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveTab('text')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            padding: '0.5rem 1rem', border: 'none', background: 'transparent',
            color: activeTab === 'text' ? 'var(--primary-color)' : '#64748b',
            fontWeight: activeTab === 'text' ? 600 : 500,
            borderBottom: activeTab === 'text' ? '2px solid var(--primary-color)' : 'none',
            cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          <Type size={18} /> Metin İçerikleri
        </button>
        <button 
          onClick={() => setActiveTab('video')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            padding: '0.5rem 1rem', border: 'none', background: 'transparent',
            color: activeTab === 'video' ? 'var(--primary-color)' : '#64748b',
            fontWeight: activeTab === 'video' ? 600 : 500,
            borderBottom: activeTab === 'video' ? '2px solid var(--primary-color)' : 'none',
            cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          <Video size={18} /> Videolar
        </button>
        <button 
          onClick={() => setActiveTab('sections')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            padding: '0.5rem 1rem', border: 'none', background: 'transparent',
            color: activeTab === 'sections' ? 'var(--primary-color)' : '#64748b',
            fontWeight: activeTab === 'sections' ? 600 : 500,
            borderBottom: activeTab === 'sections' ? '2px solid var(--primary-color)' : 'none',
            cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          <LayoutTemplate size={18} /> Ekstra Bölümler (Yeni)
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass-panel" style={{ padding: '2rem', background: '#fff' }}>
        
        {activeTab === 'text' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Üst Alan (Hero)</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Vurgulu Üst Başlık (Badge)</label>
              <input type="text" name="heroTitle" value={content.heroTitle} onChange={handleTextChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Ana Başlık</label>
              <input type="text" name="heroSubtitle" value={content.heroSubtitle} onChange={handleTextChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Açıklama Metni</label>
              <textarea name="heroDescription" value={content.heroDescription} onChange={handleTextChange} rows={4} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} />
            </div>

            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Yazılımlarımız Bölümü</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Bölüm Başlığı</label>
              <input type="text" name="aboutTitle" value={content.aboutTitle} onChange={handleTextChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Bölüm Açıklaması</label>
              <textarea name="aboutDescription" value={content.aboutDescription} onChange={handleTextChange} rows={3} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} />
            </div>

          </motion.div>
        )}

        {activeTab === 'video' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Yeni Video Ekle</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Video Başlığı</label>
                  <input type="text" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="Örn: CRM Tanıtım Videosu" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div style={{ flex: '2 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Video Embed veya Linki</label>
                  <input type="text" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={handleAddVideo} className="btn-primary" style={{ padding: '0.75rem 1.5rem', height: '42px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Ekle
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Ekli Videolar</h3>
              {(!content.videos || content.videos.length === 0) ? (
                <p style={{ color: '#64748b', fontStyle: 'italic' }}>Henüz video eklenmemiş.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {content.videos.map((video) => (
                    <div key={video.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', background: '#fff' }}>
                      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                        <iframe src={video.url} title={video.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen></iframe>
                      </div>
                      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#0f172a' }}>{video.title}</span>
                        <button onClick={() => handleRemoveVideo(video.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'sections' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => handleAddSection('text_image')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6' }}>
                <Plus size={18} /> Resimli Bilgi Alanı Ekle
              </button>
              <button onClick={() => handleAddSection('gallery')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#8b5cf6' }}>
                <Plus size={18} /> Görsel Galeri Alanı Ekle
              </button>
            </div>

            {(!content.dynamicSections || content.dynamicSections.length === 0) ? (
              <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '1rem', border: '2px dashed #cbd5e1' }}>
                <LayoutTemplate size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '0.5rem' }}>Hiç İlave Bölüm Yok</h3>
                <p style={{ color: '#64748b' }}>Sitenize yeni bilgi alanları veya resim galerileri eklemek için yukarıdaki butonları kullanın.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {content.dynamicSections.map((section, index) => (
                  <div key={section.id} style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden', background: '#f8fafc' }}>
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: section.type === 'text_image' ? '#eff6ff' : '#f5f3ff', borderBottom: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {section.type === 'text_image' ? <Type color="#3b82f6" /> : <ImageIcon color="#8b5cf6" />}
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{section.type === 'text_image' ? 'Resimli Bilgi Alanı' : 'Görsel Galeri'}</span>
                        
                        {/* Aktif/Pasif Switch */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: '2rem', fontSize: '0.9rem', color: '#475569' }}>
                          <div style={{ width: '40px', height: '20px', background: section.isActive ? '#10b981' : '#cbd5e1', borderRadius: '10px', position: 'relative', transition: 'all 0.3s' }}>
                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: section.isActive ? '22px' : '2px', transition: 'all 0.3s' }}></div>
                          </div>
                          {section.isActive ? 'Yayında' : 'Gizli'}
                          <input type="checkbox" checked={section.isActive} onChange={(e) => handleUpdateSection(section.id, 'isActive', e.target.checked)} style={{ display: 'none' }} />
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleMoveSection(index, 'up')} disabled={index === 0} style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem', background: '#fff', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1 }}><ArrowUp size={16} /></button>
                        <button onClick={() => handleMoveSection(index, 'down')} disabled={index === (content.dynamicSections?.length || 0) - 1} style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '0.4rem', background: '#fff', cursor: index === (content.dynamicSections?.length || 0) - 1 ? 'not-allowed' : 'pointer', opacity: index === (content.dynamicSections?.length || 0) - 1 ? 0.5 : 1 }}><ArrowDown size={16} /></button>
                        <button onClick={() => handleRemoveSection(section.id)} style={{ padding: '0.4rem', border: '1px solid #fee2e2', borderRadius: '0.4rem', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', marginLeft: '0.5rem' }}><Trash2 size={16} /></button>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '2 1 300px' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Bölüm Başlığı</label>
                          <input type="text" value={section.title} onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Örn: Sıkça Sorulan Sorular" />
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Sayfadaki Konumu</label>
                          <select value={section.position || 'middle'} onChange={(e) => handleUpdateSection(section.id, 'position', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                            <option value="top">Üst (Yazılımlarımız Öncesi)</option>
                            <option value="middle">Orta (Projelerden Sonra)</option>
                            <option value="bottom">Alt (İletişim Öncesi)</option>
                          </select>
                        </div>
                      </div>

                      {section.type === 'text_image' && (
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Bölüm Açıklaması</label>
                          <textarea value={section.description || ''} onChange={(e) => handleUpdateSection(section.id, 'description', e.target.value)} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }} placeholder="Bu alanın içerik metnini girin..." />
                        </div>
                      )}

                      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 500, fontSize: '0.9rem' }}>
                          {section.type === 'text_image' ? 'Yan Görsel Ekle' : 'Galeri Resimleri Ekle'}
                        </label>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                          <input 
                            type="text" 
                            id={`img-input-${section.id}`} 
                            placeholder="https://www.siteniz.com/resim.png" 
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} 
                            onKeyPress={(e) => {
                              if(e.key === 'Enter') {
                                handleAddImageToSection(section.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <button 
                            onClick={() => {
                              const input = document.getElementById(`img-input-${section.id}`) as HTMLInputElement;
                              handleAddImageToSection(section.id, input.value);
                              input.value = '';
                            }} 
                            className="btn-primary" 
                            style={{ padding: '0 1.5rem', borderRadius: '0.5rem' }}
                          >
                            Ekle
                          </button>
                        </div>

                        {/* Ekli Resimler */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                          {section.images.map((img, i) => (
                            <div key={i} style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                              <img src={img} alt={`Görsel ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button onClick={() => handleRemoveImageFromSection(section.id, i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={12} /></button>
                            </div>
                          ))}
                          {section.images.length === 0 && (
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Henüz resim eklenmemiş. Lütfen yukarıdan URL yapıştırın.</span>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default IcerikYonetimi;

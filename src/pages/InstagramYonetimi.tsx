import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  Film, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Loader2,
  Calendar,
  Settings as SettingsIcon
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../index.css';

interface ContentItem {
  id: string;
  demo_id: string;
  demo_title: string | null;
  content_type: string;
  status: string;
  caption: string | null;
  hashtags: string | null;
  file_path: string | null;
  instagram_media_id: string | null;
  created_at: string;
  published_at: string | null;
  error_message: string | null;
}

interface Stats {
  by_status: { [key: string]: number };
  last_7_days_published: number;
  today_published: number;
  total_demos: number;
}

interface GitHubSettings {
  githubOwner: string;
  githubRepo: string;
  githubToken: string;
}

const DEFAULT_SETTINGS: GitHubSettings = {
  githubOwner: '',
  githubRepo: 'instagram-ai-bot',
  githubToken: ''
};

function InstagramYonetimi() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [demosCount, setDemosCount] = useState<number>(0);
  const [stats, setStats] = useState<Stats>({ by_status: {}, last_7_days_published: 0, today_published: 0, total_demos: 0 });
  const [gitSettings, setGitSettings] = useState<GitHubSettings>(DEFAULT_SETTINGS);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    // 1. Load GitHub Settings from Firestore
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'instagram');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGitSettings(docSnap.data() as GitHubSettings);
        }
      } catch (err) {
        console.error('Settings load error:', err);
      }
    };
    loadSettings();

    // 2. Realtime listener for Demos
    const unsubscribeDemos = onSnapshot(collection(db, 'instagram_demos'), (snapshot) => {
      setDemosCount(snapshot.size);
    });

    // 3. Realtime listener for Content Items
    const q = query(collection(db, 'instagram_content_items'), orderBy('created_at', 'desc'), limit(30));
    const unsubscribeContents = onSnapshot(q, async (snapshot) => {
      const itemsList: ContentItem[] = [];
      const statsObj: Stats = { by_status: {}, last_7_days_published: 0, today_published: 0, total_demos: 0 };
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      for (const itemDoc of snapshot.docs) {
        const data = itemDoc.data();
        const status = data.status || 'pending';
        statsObj.by_status[status] = (statsObj.by_status[status] || 0) + 1;

        if (status === 'published' && data.published_at) {
          const pubDate = new Date(data.published_at);
          if (pubDate >= todayStart) statsObj.today_published += 1;
          if (pubDate >= weekAgo) statsObj.last_7_days_published += 1;
        }

        // Fetch demo title (simple cache/join)
        let demoTitle = 'Yükleniyor...';
        if (data.demo_id) {
          try {
            const demoSnap = await getDoc(doc(db, 'instagram_demos', data.demo_id));
            if (demoSnap.exists()) {
              demoTitle = demoSnap.data().title || data.demo_id;
            } else {
              demoTitle = data.demo_id;
            }
          } catch (e) {
            demoTitle = data.demo_id;
          }
        }

        itemsList.push({
          id: itemDoc.id,
          demo_id: data.demo_id,
          demo_title: demoTitle,
          content_type: data.content_type || 'image_post',
          status: status,
          caption: data.caption || '',
          hashtags: data.hashtags || '',
          file_path: data.file_path || '',
          instagram_media_id: data.instagram_media_id || '',
          created_at: data.created_at || '',
          published_at: data.published_at || '',
          error_message: data.error_message || ''
        });
      }

      setContents(itemsList);
      setStats(prev => ({
        ...prev,
        by_status: statsObj.by_status,
        today_published: statsObj.today_published,
        last_7_days_published: statsObj.last_7_days_published
      }));
    });

    return () => {
      unsubscribeDemos();
      unsubscribeContents();
    };
  }, []);

  // Update total demos in stats when count changes
  useEffect(() => {
    setStats(prev => ({ ...prev, total_demos: demosCount }));
  }, [demosCount]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setMessage(null);
    try {
      await setDoc(doc(db, 'settings', 'instagram'), gitSettings);
      setMessage({ text: 'Ayarlar başarıyla kaydedildi!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Ayarlar kaydedilirken hata oluştu.', type: 'error' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTrigger = async (kind: string) => {
    if (!gitSettings.githubOwner || !gitSettings.githubRepo || !gitSettings.githubToken) {
      setMessage({ text: 'Lütfen önce Ayarlar sekmesinden GitHub bağlantı bilgilerini doldurun.', type: 'error' });
      return;
    }

    setActionLoading(kind);
    setMessage(null);

    try {
      // Call GitHub Repository Dispatch API
      const url = `https://api.github.com/repos/${gitSettings.githubOwner}/${gitSettings.githubRepo}/dispatches`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${gitSettings.githubToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'trigger_bot',
          client_payload: { kind }
        })
      });

      if (response.status === 204) {
        setMessage({ text: 'GitHub Actions botu başarıyla tetiklendi! Video/görsel üretimi ve paylaşım işlemi arka planda başladı. (1-2 dakika sürebilir)', type: 'success' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage({ text: `GitHub tetikleme hatası (${response.status}): ${errorData.message || 'Yetki hatası veya geçersiz token.'}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'GitHub API bağlantısı kurulamadı. İnternet bağlantınızı kontrol edin.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = async (id: string) => {
    // To retry in Firestore, we just update the status to 'pending' and trigger GitHub
    setActionLoading(`retry-${id}`);
    setMessage(null);
    try {
      const itemRef = doc(db, 'instagram_content_items', id);
      await setDoc(itemRef, { 
        status: 'pending',
        error_message: null,
        retry_count: 0
      }, { merge: true });
      
      // Fetch item to know the kind
      const snap = await getDoc(itemRef);
      const kind = snap.exists() ? snap.data().content_type : 'image_post';

      // Trigger GitHub
      await handleTrigger(kind);
    } catch (error) {
      setMessage({ text: 'Yeniden deneme kaydı güncellenemedi.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const getMediaUrl = (filePath: string | null) => {
    if (!filePath) return '';
    // Since images/videos are uploaded to a hosting provider in GitHub Action (like S3/Firebase Storage),
    // the file_path might hold a remote URL directly. If it's a local path, we show placeholder or icon.
    if (filePath.startsWith('http')) {
      return filePath;
    }
    return '';
  };

  const filteredContents = contents.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: { bg: string; color: string; label: string; icon: any } } = {
      published: { bg: '#ecfdf5', color: '#10b981', label: 'Yayında', icon: <CheckCircle2 size={14} /> },
      failed: { bg: '#fee2e2', color: '#ef4444', label: 'Başarısız', icon: <AlertCircle size={14} /> },
      ready: { bg: '#fef3c7', color: '#f59e0b', label: 'Hazır', icon: <Clock size={14} /> },
      processing: { bg: '#eff6ff', color: '#3b82f6', label: 'İşleniyor', icon: <Loader2 size={14} className="animate-spin" /> },
      pending: { bg: '#f1f5f9', color: '#64748b', label: 'Bekliyor', icon: <Clock size={14} /> },
    };
    const current = styles[status] || { bg: '#f1f5f9', color: '#64748b', label: status, icon: <Clock size={14} /> };
    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.25rem', 
        padding: '0.25rem 0.75rem', 
        borderRadius: '999px', 
        fontSize: '0.75rem', 
        fontWeight: 600, 
        backgroundColor: current.bg, 
        color: current.color 
      }}>
        {current.icon}
        {current.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', borderRadius: '0.75rem', color: '#fff', display: 'flex' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </div>
            <h1 style={{ fontSize: '1.875rem', color: '#0f172a', margin: 0 }}>Instagram Otomasyonu (Serverless)</h1>
          </div>
          <p style={{ color: '#64748b' }}>Bulut üzerinden (GitHub Actions) çalışan 7/24 otomatik dikey video (Reels) üretici.</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: '0.5rem 1rem', border: 'none', background: activeTab === 'dashboard' ? '#fff' : 'transparent', color: '#0f172a', fontWeight: 600, borderRadius: '0.375rem', cursor: 'pointer' }}
          >
            Panel
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{ padding: '0.5rem 1rem', border: 'none', background: activeTab === 'settings' ? '#fff' : 'transparent', color: '#0f172a', fontWeight: 600, borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <SettingsIcon size={16} /> GitHub Ayarları
          </button>
        </div>
      </header>

      {/* Message feedback */}
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ 
            padding: '1rem 1.5rem', 
            borderRadius: '0.75rem', 
            background: message.type === 'success' ? '#ecfdf5' : '#fee2e2', 
            color: message.type === 'success' ? '#065f46' : '#991b1b', 
            border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <AlertCircle size={20} />
          <span style={{ fontWeight: 500 }}>{message.text}</span>
        </motion.div>
      )}

      {activeTab === 'dashboard' ? (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #6366f1' }}>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Toplam Demo Kaynağı</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.total_demos || 0}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #10b981' }}>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Bugün Yayınlanan</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.today_published || 0}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #8b5cf6' }}>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Son 7 Gün</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.last_7_days_published || 0}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel" style={{ padding: '1.5rem', background: '#fff', borderLeft: '4px solid #ef4444' }}>
              <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Başarısız Paylaşımlar</h3>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{stats.by_status.failed || 0}</p>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Manual Trigger Panel */}
            <motion.div className="glass-panel" style={{ padding: '2rem', background: '#fff' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Sparkles size={20} color="#6366f1" /> Manuel İçerik Üretimi ve Paylaşımı
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Aşağıdaki butonları kullanarak GitHub Actions iş akışını tetikleyebilir ve sıradaki bir demodan otomatik olarak dikey video (Reels) veya görsel üretilmesini sağlayabilirsiniz.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  disabled={actionLoading !== null}
                  onClick={() => handleTrigger('image_post')}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', flex: 1, justifyContent: 'center' }}
                >
                  {actionLoading === 'image_post' ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Tetikleniyor...
                    </>
                  ) : (
                    <>
                      <ImageIcon size={18} /> Poster Üret ve Paylaş
                    </>
                  )}
                </button>

                <button 
                  disabled={actionLoading !== null}
                  onClick={() => handleTrigger('carousel')}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', flex: 1, justifyContent: 'center', background: '#8b5cf6' }}
                >
                  {actionLoading === 'carousel' ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Tetikleniyor...
                    </>
                  ) : (
                    <>
                      <Layers size={18} /> Carousel Üret ve Paylaş
                    </>
                  )}
                </button>

                <button 
                  disabled={actionLoading !== null}
                  onClick={() => handleTrigger('reel')}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.5rem', flex: 1, justifyContent: 'center', background: '#ec4899' }}
                >
                  {actionLoading === 'reel' ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Tetikleniyor...
                    </>
                  ) : (
                    <>
                      <Film size={18} /> Reels (Video) Üret ve Paylaş
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Scheduler Status */}
            <motion.div className="glass-panel" style={{ padding: '1.5rem', background: '#fff', height: '100%' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Calendar size={18} color="#10b981" /> Zamanlanmış Görevler
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>GitHub Actions Aktif</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 500 }}>🌅 Sabah Paylaşımı (Poster)</span>
                  <span style={{ color: '#6366f1', fontWeight: 600 }}>09:05 TSİ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 500 }}>🌇 Öğleden Sonra (Carousel)</span>
                  <span style={{ color: '#6366f1', fontWeight: 600 }}>14:05 TSİ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 500 }}>🌃 Akşam Paylaşımı (Reels)</span>
                  <span style={{ color: '#6366f1', fontWeight: 600 }}>19:05 TSİ</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contents Section */}
          <motion.div className="glass-panel" style={{ padding: '2rem', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>📱 Son Üretilen İçerikler</h2>
              
              {/* Filters */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'published', 'failed', 'ready', 'processing'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '999px',
                      border: '1px solid #e2e8f0',
                      background: filter === f ? '#6366f1' : 'transparent',
                      color: filter === f ? '#fff' : '#64748b',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {f === 'all' ? 'Tümü' : f === 'published' ? 'Yayında' : f === 'failed' ? 'Başarısız' : f === 'ready' ? 'Hazır' : 'İşleniyor'}
                  </button>
                ))}
              </div>
            </div>

            {filteredContents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Filtreye uygun içerik bulunamadı.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filteredContents.map(item => (
                  <div 
                    key={item.id} 
                    className="glass-panel"
                    style={{ 
                      background: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '1rem', 
                      overflow: 'hidden', 
                      display: 'flex', 
                      flexDirection: 'column',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                    }}
                  >
                    {/* Media Preview */}
                    <div style={{ width: '100%', aspectRatio: '4/5', background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #f1f5f9' }}>
                      {item.file_path ? (
                        item.content_type === 'reel' ? (
                          <video src={getMediaUrl(item.file_path)} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <img src={getMediaUrl(item.file_path)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )
                      ) : (
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                          {item.status === 'processing' ? 'Hazırlanıyor...' : 'Önizleme Linki Bekleniyor'}
                        </div>
                      )}
                      
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>
                        {item.content_type === 'image_post' ? 'Görsel Post' : item.content_type === 'carousel' ? 'Kaydırmalı Post' : 'Reels Video'}
                      </span>
                      
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                        {item.demo_title}
                      </h4>

                      <p style={{ 
                        fontSize: '0.825rem', 
                        color: '#64748b', 
                        margin: '0.5rem 0',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.caption || 'Açıklama üretiliyor...'}
                      </p>

                      {item.hashtags && (
                        <p style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 500, margin: '0.5rem 0 1rem 0' }}>
                          {item.hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ')}
                        </p>
                      )}

                      {item.error_message && item.status === 'failed' && (
                        <div style={{ marginTop: 'auto', padding: '0.5rem 0.75rem', background: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fee2e2', color: '#b91c1c', fontSize: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item.error_message}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        {item.status === 'failed' && (
                          <button 
                            disabled={actionLoading === `retry-${item.id}`}
                            onClick={() => handleRetry(item.id)}
                            className="btn-primary" 
                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: '#dc2626' }}
                          >
                            {actionLoading === `retry-${item.id}` ? <Loader2 size={14} className="animate-spin" /> : 'Yeniden Dene'}
                          </button>
                        )}
                        {item.instagram_media_id && (
                          <a 
                            href={`https://instagram.com/p/${item.instagram_media_id}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="btn-primary" 
                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: '#1e293b', textDecoration: 'none', color: '#fff' }}
                          >
                            IG'de Aç <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      ) : (
        /* Settings Tab */
        <motion.div className="glass-panel" style={{ padding: '2rem', background: '#fff' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <SettingsIcon size={20} color="#0f172a" /> GitHub Actions & API Bağlantı Ayarları
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            React ön yüzünün, GitHub deposundaki tetikleme iş akışını başlatabilmesi için aşağıdaki bilgileri doldurmanız gerekmektedir.
          </p>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>GitHub Kullanıcı Adı veya Organizasyon (Owner)</label>
              <input 
                type="text" 
                value={gitSettings.githubOwner} 
                onChange={(e) => setGitSettings({ ...gitSettings, githubOwner: e.target.value })}
                placeholder="Örn: k2berdal" 
                required
                style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>GitHub Depo Adı (Repository)</label>
              <input 
                type="text" 
                value={gitSettings.githubRepo} 
                onChange={(e) => setGitSettings({ ...gitSettings, githubRepo: e.target.value })}
                placeholder="Örn: instagram-ai-bot" 
                required
                style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>GitHub Personal Access Token (PAT)</label>
              <input 
                type="password" 
                value={gitSettings.githubToken} 
                onChange={(e) => setGitSettings({ ...gitSettings, githubToken: e.target.value })}
                placeholder="ghp_xxxxxxxxxxxx" 
                required
                style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} 
              />
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                GitHub Hesabınızdan (Settings → Developer Settings → Personal Access Tokens → Tokens classic) `repo` ve `workflow` izinlerine sahip classic bir token üretmeniz gerekmektedir.
              </span>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={savingSettings}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', padding: '0.875rem 2rem', marginTop: '1rem' }}
            >
              {savingSettings ? <Loader2 className="animate-spin" size={18} /> : 'Ayarları Kaydet'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}

export default InstagramYonetimi;

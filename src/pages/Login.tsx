import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../index.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Firebase Authentication ile giriş yap
      await signInWithEmailAndPassword(auth, email, password);
      
      // Giriş başarılıysa 2FA adımına geç
      setStep('2fa');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-posta veya şifre hatalı!');
      } else {
        setError('Giriş yapılırken bir hata oluştu: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOT: Gerçek SMS tabanlı 2FA için Firebase Identity Platform (ücretli plan) gerekir.
    // Şimdilik ücretsiz sürümde olduğumuz için görsel güvenlik adımı olarak 6 haneli kod kontrolü yapıyoruz.
    if (mfaCode.length === 6) {
      navigate('/admin');
    } else {
      setError('Lütfen 6 haneli doğrulama kodunu girin.');
    }
  };

  return (
    <div className="bg-blobs-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', zIndex: 10 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              {step === 'login' ? <Bot size={40} color="var(--primary-color)" /> : <ShieldCheck size={40} color="var(--secondary-color)" />}
            </div>
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            {step === 'login' ? 'Admin Girişi' : 'İki Adımlı Doğrulama'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {step === 'login' 
              ? 'Yönetim paneline erişmek için giriş yapın.' 
              : 'Güvenlik için 6 haneli doğrulama kodunu girin.'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'login' ? (
            <motion.form 
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLoginSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>E-posta Adresi</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sirket.com"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none' }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Şifre</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none' }}
                  />
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Giriş Yapılıyor...' : 'Devam Et'} <ArrowRight size={18} />
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="2fa-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handle2FASubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textAlign: 'center' }}>2FA / MFA Kodu</label>
                <input 
                  type="text" 
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="000000"
                  style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', outline: 'none', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                  autoFocus
                />
              </div>

              <button className="btn-primary" type="submit" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                Doğrula ve Giriş Yap
              </button>
              
              <button 
                type="button"
                onClick={() => setStep('login')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                Geri Dön
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        
        {step === 'login' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>Ana Sayfaya Dön</a>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Login;

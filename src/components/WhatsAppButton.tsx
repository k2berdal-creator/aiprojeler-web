import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle } from 'lucide-react';

function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const phoneNumber = "905366632474"; 

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '5.5rem',
              right: '2rem',
              width: '350px',
              backgroundColor: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Chat Header */}
            <div style={{ backgroundColor: '#075e54', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#25D366', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <MessageCircle size={24} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Canlı Destek</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Genellikle birkaç dakika içinde yanıt verir</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div style={{ backgroundColor: '#e5ddd5', padding: '1rem', height: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#fff', padding: '0.75rem 1rem', borderRadius: '0 1rem 1rem 1rem', maxWidth: '80%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#303030' }}>
                  Merhaba! 👋 <br/><br/>Yazılımlarımız, lisanslama veya diğer konular hakkında size nasıl yardımcı olabilirim?
                </p>
                <span style={{ display: 'block', textAlign: 'right', fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Chat Footer / Input */}
            <form onSubmit={handleSend} style={{ padding: '0.75rem', backgroundColor: '#f0f0f0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Mesajınızı yazın..." 
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '9999px', border: 'none', outline: 'none', fontSize: '0.9rem' }}
                autoFocus
              />
              <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#075e54', color: '#fff', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                <Send size={18} style={{ marginLeft: '-2px' }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '65px',
          height: '65px',
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
          zIndex: 9999,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {isOpen ? <X size={28} /> : (
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </motion.button>
    </>
  );
}

export default WhatsAppButton;

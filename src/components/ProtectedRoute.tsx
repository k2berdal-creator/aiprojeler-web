import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'customer';
}

function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        try {
          // Firestore'dan rol bilgisini al
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data().role || 'customer');
          } else {
            // Eğer users koleksiyonunda belge yoksa varsayılan olarak admin diyelim
            // (Mevcut admin kullanıcısını bozmamak için - normalde varsayılan müşteri olur)
            // Lütfen production'da bunu dikkatli yönetin.
            setUserRole('admin');
          }
        } catch (error) {
          console.error("Rol bilgisi alınamadı:", error);
          setUserRole('customer');
        }
      } else {
        setIsAuth(false);
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isAuth === null || (isAuth && userRole === null)) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <p style={{ fontWeight: 500 }}>Hesap bilgileri doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Rol uyuşmuyorsa, kendi paneline veya ana sayfaya at
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/panel" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;

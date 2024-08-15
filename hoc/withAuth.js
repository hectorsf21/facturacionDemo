import Loading from '@/pages/components/Loading';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
      const checkAuth = () => {
        if (!token) {
          router.replace('/'); // Redirige a '/' si no hay token
        } else {
          setLoading(false); // El token es válido, detiene el estado de carga
        }
      };

      checkAuth();
    }, [token, router]);

    if (loading) {
      return <Loading/>; // Muestra un mensaje de carga o un componente mientras se verifica el token
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

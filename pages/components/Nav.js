import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loading from './Loading';

export default function Nav({cajeros}) {
  // console.log(cajeros)
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { route, events, push } = useRouter();
  const [usuario, setUsuario] = useState()
  
  const inactiveLink = 'flex gap-2 p-2 items-center';
  const activeLink = inactiveLink + ' bg-white text-blue-900 rounded-l-lg';

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('usuario'))
    setUsuario(user)
  },[])
  
  useEffect(() => {
    // Mostrar el loading al iniciar la navegación
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

  

    // Ocultar el loading cuando la navegación se completa
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    events.on('routeChangeStart', handleRouteChangeStart);
    events.on('routeChangeComplete', handleRouteChangeComplete);
    events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart);
      events.off('routeChangeComplete', handleRouteChangeComplete);
      events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [events]);
  // PARA EL DESPLAZAMIENTO DE IZQUIERDA A DERECHA EN MOBILES
  useEffect(() => {
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        window.initialX = touch.clientX;
        window.initialY = touch.clientY;
    };

    const handleTouchMove = (e) => {
        if (!window.initialX || !window.initialY) return;
      
        const touch = e.touches[0];
        const diffX = touch.clientX - window.initialX;
        const diffY = touch.clientY - window.initialY;
      
        const menuRect = menuRef.current.getBoundingClientRect();
      
        // Check if the touch is within the menu's area
        const isInMenu = touch.clientX >= menuRect.left && touch.clientX <= menuRect.right &&
                         touch.clientY >= menuRect.top && touch.clientY <= menuRect.bottom;

        if (isInMenu && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                // Desplazamiento hacia la derecha
                setIsMenuVisible(true);
            } else if (diffX < 0) {
                // Desplazamiento hacia la izquierda
                setIsMenuVisible(false);
            }
        }

        window.initialX = null;
        window.initialY = null;
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
    };
}, []);

const handleSalir = () => {
  localStorage.removeItem('token');
  push('/');
};

  return (
    <>
    {isLoading && <Loading />}
      <aside ref={menuRef} className={`h-full drop-shadow-md bg-black text-white p-4 pr-0 transition-all ${isMenuVisible ? 'w-48' : 'w-20'} sm:w-auto`}>
        <div className='flex justify-center mb-4 mt-4'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
        {usuario?.usuario === 'hectorsf21' && <h1 className='text-white text-center mb-4'>MASTER</h1>}
        {usuario && <h1 className='text-white text-center mb-4'>{usuario?.nombre?.toUpperCase()}</h1>}
        <nav className='flex flex-col gap-2'>
          <Link href={'/'} className={route === '/' ? activeLink : inactiveLink}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>
            <span className={`ml-2 ${isMenuVisible ? 'inline' : 'hidden'} md:inline`}>Facturación</span>
          </Link>

          <Link href={'/cajeros'} className={route === '/cajeros' ? activeLink : inactiveLink}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <span className={`ml-2 ${isMenuVisible ? 'inline' : 'hidden'} md:inline`}>Cajeros</span>
          </Link>

          <Link href={'/caja'} className={route === '/caja' ? activeLink : inactiveLink}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661ZM4.5 13.5h15m-11.25 3.75h7.5" />
            </svg>
            <span className={`ml-2 ${isMenuVisible ? 'inline' : 'hidden'} md:inline`}>Caja</span>
          </Link>

          <Link href={'/clientes'} className={route === '/clientes' ? activeLink : inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>

            <span className={`ml-2 ${isMenuVisible ? 'inline' : 'hidden'} md:inline`}>Clientes</span>
          </Link>

          <Link href={'/productos'} className={route === '/productos' ? activeLink : inactiveLink}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>

            <span className={`ml-2 ${isMenuVisible ? 'inline' : 'hidden'} md:inline`}>Productos</span>
          </Link>

          <Link href={'/facturas'} className={route === '/facturas' ? activeLink : inactiveLink}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5M8.25 16.5h7.5m-9.75 3.75h12A2.25 2.25 0 0 0 20.25 18V6a2.25 2.25 0 0 0-2.25-2.25h-12A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Zm12-12V4.25M6 20.25h12" />
            </svg>
            <span className={`ml-2 ${isMenuVisible ? 'inline' : 'hidden'} md:inline`}>Facturas</span>
          </Link>
          {/* <div className='flex gap-2 p-2 items-center cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
            <span onClick={handleSalir} className={`ml-2 ${isMenuVisible ? 'inline' : 'hidden'} md:inline`}>Salir</span>
          </div> */}
          
        </nav>
      </aside>
    </>
  );
}

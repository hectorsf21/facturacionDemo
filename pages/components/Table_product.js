import { useState } from 'react';
import { useTask } from '@/context/TaskContext';

export default function Component({ producto, facturaRef }) {
  const { setProducto, product } = useTask();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClick = (p) => {
    setProducto((prevProductos) => [...prevProductos, p]);
    if (facturaRef.current) {
      facturaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredClientes = producto && producto.length > 0 
    ? producto.filter(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase())) 
    : [];

  return (
    <div className="w-full p-0 lg:p-2">
      <div className="flex items-center justify-start lg:justify-between py-4 bg-white border-b">
        <h1 className="text-md lg:text-xl font-bold mr-4 lg:m-auto">PRODUCTOS</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearch}
            className="border w-[200px] lg:w-full pl-3 pr-10 py-2 borders rounded"
          />
          <span className="absolute top-1 right-0 mt-2 mr-3">
            <SearchIcon className="w-4 h-4" />
          </span>
        </div>
      </div>
      <div className="p-4 bg-gray-300 max-h-72 overflow-y-auto">
        <table className="w-full text-left text-sm table-auto">
          <thead>
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Gramos</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((c, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2">{c.nombre.toUpperCase()}</td>
                <td className="p-2">{c.gramos}MG</td>
                <td className="p-2">{c.precio}BS</td>
                <td className="p-2">
                  <a href='#factura'>
                  <button 
                    onClick={() => handleClick(c)} 
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-black"
                  >
                    Seleccionar
                  </button>
                  </a>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

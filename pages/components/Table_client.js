import { useState } from 'react';
import { useTask } from '@/context/TaskContext';

export default function Component({ cliente }) {
  const { client, setClient } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayClient, setDisplayClient] = useState(false);

  // Función para obtener el valor del buscador
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para filtrar los clientes
  const filteredClientes = cliente && cliente.length > 0 ? cliente.filter(c =>
    c.nombres.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Función para seleccionar un cliente
  const handleClick = (c) => {
    setClient(c);
  };

  // Función para manejar el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  // Función para manejar el envío del formulario
  const handleClient = (e) => {
    e.preventDefault();
    console.log(client);
  };

  const handleClientManual = (e) => {
    e.preventDefault();
    setDisplayClient(false);
  };

  const handleClientSearch = (e) => {
    e.preventDefault();
    setDisplayClient(true);
  };

  return (
    <div className="w-full p-0 lg:p-2">
      <div className="flex mb-4">
        <button 
          className={`border px-4 py-2 ${displayClient ? 'bg-orange-500' : 'bg-black text-white'}`} 
          onClick={handleClientManual}
        >
          INGRESAR CLIENTE
        </button>
        <button 
          className={`border px-4 py-2 ml-2 ${displayClient ? 'bg-black text-white' : 'bg-orange-500'}`} 
          onClick={handleClientSearch}
        >
          BUSCAR CLIENTE
        </button>
      </div>
      
      {/* Formulario */}
      <div className={displayClient ? 'hidden' : ''}>
        <form onSubmit={handleClient} className="w-full lg:w-1/2 mt-4 p-4 border rounded-lg shadow-lg">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombres">
            NOMBRE
          </label>
          <input
            onChange={handleChange}
            id="nombres"
            type="text"
            name="nombres"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label className="mt-4 block text-gray-700 text-sm font-bold mb-2" htmlFor="cedula">
            CEDULA
          </label>
          <input
            onChange={handleChange}
            id="cedula"
            type="text"
            name="cedula"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </form>
      </div>
      
      {/* Tabla */}
      <div className={displayClient ? '' : 'hidden'}>
        <div className="flex items-center justify-between py-4 bg-white border-b">
          <h1 className="text-xl font-bold">CLIENTES</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={handleSearch}
              className="w-[200px] lg:w-full pl-3 pr-10 py-2 border rounded"
            />
            <span className="absolute top-1 right-0 mt-2 mr-3">
              <SearchIcon className="w-4 h-4" />
            </span>
          </div>
        </div>
        <div className="p-4 bg-gray-300 max-h-72 overflow-y-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((c, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-2">{c.nombres.toUpperCase()} {c.apellidos.toUpperCase()}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => handleClick(c)} 
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-black"
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

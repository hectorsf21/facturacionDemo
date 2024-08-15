import React, { useState } from 'react';
import Layout from './components/Layout';
import axios from 'axios';
import MsgExito from './components/MsgExito';
import { useTask } from '@/context/TaskContext';
import connectdb from '@/lib/db';
import cajerosModel from '@/models/cajeros';

// SERVER
export const getServerSideProps = async () => {
  try {
      await connectdb()
      const resp = await cajerosModel.find({})
      const initialCajeros = resp.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      return { props: {initialCajeros} }
  } catch (err) {
      console.log(err)
      return { props: { initialCajeros: []} }
  }
}
// CLOSE SERVER

export default function Cajeros({initialCajeros}) {
  const {displayModal, setDisplayModal} = useTask();
  const [formData, setFormData] = useState({
    nombre:'',
    usuario: '',
    password: '',
  });
  const [editingId, setEditingId] = useState(null);

  // CAPTURA DE DATOS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };
// ENVIO DE DATOS

  // const handleSubmit = (e)=>{
  //   e.preventDefault()
  //   console.log(formData)
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Editar Cajero
        const resp = await axios.put(`/api/cajeros/edit`, { id: editingId, ...formData });
        if(resp.data.message === 'Cajero editado correctamente'){
          setDisplayModal(!displayModal);
          setEditingId(null);
          setFormData({ nombre: '', usuario: '', password: '' });
        }
      } else {
        // Crear Cajero
        const resp = await axios.post('/api/cajeros/create', { formData });
        if(resp.data.message === 'Cajero creado correctamente'){
          setDisplayModal(!displayModal);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (cajero) => {
    setEditingId(cajero._id);
    setFormData({ nombre: cajero.nombre, usuario: cajero.usuario, password: '' });
  };

  const handleDelete = async (id) => {
    try {
      const resp = await axios.delete(`/api/cajeros/delete`, { data: { id } });
      if(resp.data.message === 'Cajero eliminado correctamente'){
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <MsgExito message={editingId ? 'Cajero editado correctamente' : 'Cajero creado correctamente'} />
      <div className="max-w-xl mx-auto p-4">
        {/* Formulario */}
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          {/* NOMBRE */}
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
              Nombre
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="nombre"
              type="text"
              placeholder="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          {/* USUARIO */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usuario">
              Usuario
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="usuario"
              type="text"
              placeholder="Usuario"
              value={formData.usuario}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              type="text"
              placeholder="************"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {editingId ? 'Actualizar' : 'Enviar'}
            </button>
          </div>
        </form>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Editar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody>
              {initialCajeros.map((cajero) => (
                <tr key={cajero._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cajero.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(cajero)}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(cajero._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

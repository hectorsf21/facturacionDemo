import React, {useState} from 'react'
import Layout from './components/Layout'
import axios from 'axios';
import connectdb from '@/lib/db';
import clientesModel from '@/models/clientes';


// SERVER
export const getServerSideProps = async () => {
    try {
        await connectdb()
        const resp = await clientesModel.find({})
        const initialClients = resp.map((e) => {
            const user = e.toObject()
            user._id = e._id.toString()
            return user
        })
        return { props: {initialClients} }
    } catch (err) {
        console.log(err)
        return { props: { initialClients: []} }
    }
  
  }
  // CLOSE SERVER

export default function clientes({initialClients}) {

    const [clientNew, setClientNew] = useState({
        nombres: "",
        apellidos: "",
        cedula: "",
        credito: "",
        abono: ""
      });
    
      const [clients, setClients] = useState(initialClients);
      const [editingClient, setEditingClient] = useState(null);

      const handleChange = (e) => {
        setClientNew({ ...clientNew, [e.target.name]: e.target.value });
      };


    // FUNCION ENVIAR
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (editingClient) {
            const response = await axios.put("/api/clientes/edit", { ...clientNew, id: editingClient._id });
            setClients(clients.map(client => client._id === response.data._id ? response.data : client));
          } else {
            const response = await axios.post("/api/clientes/create", clientNew);
            setClients([...clients, response.data]);
          }
          setClientNew({ nombres: "", apellidos: "", cedula: "", credito: "", abono: "" });
          setEditingClient(null);
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      };
    //   FUNCION EDITAR

    const handleEdit = (client) => {
        setClientNew(client);
        setEditingClient(client);
      };

    // FUNCION ELIMINAR 
    const handleDelete = async (id) => {
        try {
          await axios.delete("/api/clientes/eliminar", { data: { id } });
          setClients(clients.filter(client => client._id !== id));
        } catch (error) {
          console.error("Error deleting client:", error);
        }
      };


  return (
    <>
    <Layout>
    <div className="w-full sm:w-1/2 mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Nombres</label>
          <input
            type="text"
            name="nombres"
            value={clientNew.nombres}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={clientNew.apellidos}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Cédula</label>
          <input
            type="text"
            name="cedula"
            value={clientNew.cedula}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Crédito</label>
          <input
            type="text"
            name="credito"
            value={clientNew.credito}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Abono</label>
          <input
            type="text"
            name="abono"
            value={clientNew.abono}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded">
            {editingClient ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>

      </form>
      <div className='overflow-x-auto'>
      <table className="min-w-full mt-8 bg-white rounded shadow-md ">
      <thead className="bg-gray-50">
      <tr>
      <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
        Nombres
      </th>
      <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
        Crédito
      </th>
      <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
        Editar
      </th>
      <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
        Eliminar
      </th>
    </tr>
  </thead>
  <tbody className="bg-white">
    {clients.map((client) => (
      <tr key={client._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          {client.nombres} {client.apellidos}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          {client.credito}
        </td>
        <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <button onClick={() => handleEdit(client)} className="text-blue-500">
            Editar
          </button>
        </td>
        <td className="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <button onClick={() => handleDelete(client._id)} className="text-red-500">
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
    </>
  )
}

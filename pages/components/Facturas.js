import React, { use, useEffect, useState } from 'react';
import { useTask } from '@/context/TaskContext';
import axios from 'axios';
import Delete from './Delete';
export default function Facturas({facturabd}) {
  const {displayModal, setDisplayModal, deleteObject, setDeleteObject, facturaSelect, setFacturaSelect, closetFormat, setCloseFormat } = useTask()

  const [date, setDate] = useState('');

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const formatDateToDDMMYYYY = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
  };

  const filteredFacturas = facturabd ? facturabd.filter((factura) => {
    if (!date) return true; // Si no hay fecha seleccionada, mostrar todas las facturas
    const selectedDate = formatDateToDDMMYYYY(date);
    return factura.factura.fecha === selectedDate; // Filtrar facturas por fecha
    
  }):[];

  const handleSelect = (e)=>{
    setFacturaSelect(e)
    setCloseFormat(!closetFormat)

  }

  // ELIMINAR FACTURA
  const handleDelete = async(e)=>{
      try {
        setDisplayModal(!displayModal)
        const resp = await axios.delete('/api/factura/delete',  {
          data: { _id: e._id }
        });
        console.log(resp)
      } catch (error) {
        console.log(error)
      }
  }
  return (
    <>
    <Delete
    message={'Estas seguro de eliminar esta facura?'}
    />
      <div className="mt-4 bg-gray-200 p-8 min-h-screen">
        <h1 className="text-center text-3xl font-bold mb-6">Lista de Facturas</h1>
        <div className="mb-6">
          <span className='font-semibold mr-4'>BUSCAR POR FECHA:</span>
           <input
            type="date"
            value={date}
            onChange={handleDateChange} // Agregar evento de cambio
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="overflow-x-auto h-[630px]">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="py-3 px-6 text-left">Número</th>
                <th className="py-3 px-6 text-left">Fecha</th>
                <th className="py-3 px-6 text-left">Total</th>
                <th className="py-3 px-6 text-left">Cliente</th>
                <th className="py-3 px-6 text-left">Acción</th>
                <th className="py-3 px-6 text-left">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas && filteredFacturas.map((e, index) => (
                <tr key={index}>
                  <td className="py-4 px-6">{e.factura.numero}</td>
                  <td className="py-4 px-6">{e.factura.fecha}</td>
                  <td className="py-4 px-6">{e.factura.total}</td>
                  <td className="py-4 px-6">{e.factura.cliente ? e.factura.cliente.nombres:''}</td>
                  <td className="py-4 px-6">
                    <button onClick={()=>handleSelect(e.factura)} className='bg-orange-500 px-4 py-2 text-white rounded hover:bg-black'>Seleccionar</button>
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={()=>handleDelete(e)} className='bg-red-500 px-4 py-2 text-white rounded hover:bg-black'>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

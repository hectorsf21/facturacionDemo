import React, {useState} from 'react'
import Layout from './components/Layout'
import axios from 'axios'
import connectdb from '@/lib/db'
import formatoModel from '@/models/formato'
import Facturas from './components/Facturas'
import facturaModel from '@/models/facturas'
import MsgExito from './components/MsgExito'
import { useTask } from '@/context/TaskContext'
import Formato from './components/Formato'

// SERVER
export const getServerSideProps = async () => {
  try {
      await connectdb()
      const resp = await formatoModel.find({})
      const formatoFact = resp.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      const respuesta = await facturaModel.find({})
      const facturabd = respuesta.map((e)=>{
        const user = e.toObject()
        user._id = e.id.toString()
        return user
      })
      return { props: { formatoFact, facturabd } }
  } catch (err) {
      console.log(err)
      return { props: { formatoFact: [], facturabd: [] } }
  }

}
// CLOSE SERVER

export default function facturas({formatoFact, facturabd}) {
  
  const {displayModal, setDisplayModal} = useTask()
  const [format, setFormat] = useState(
    {
      direccion:'',
      rif:'',
      compania:''
    }
  )

  const handleChange = (e)=>{
    const {name, value} = e.target
      setFormat({...format, [name]:value })    
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    console.log(format)
    handleSend(format)
  }

  const handleSend = async (format)=>{
    try {
      const resp = await axios.post('/api/formato', {format})
      console.log(resp.data.message)
      if(resp.data.message === 'Formato enviado con éxito'){
        setDisplayModal(!displayModal)
      } 
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
    <MsgExito
    message={'FORMATO CAMBIADO CORRECTAMENTE'}
    />
    <Layout>
    <div className='flex flex-wrap my-6'>
      {/* FORMULARIO FORMATO */}
        <div className='w-full mb-4 sm:w-1/2 sm:min-w-64'>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
          <h1 className='font-semibold text-center text-xl my-6'>CREAR/MODIFICAR FORMATO DE FACTURA</h1>
      <div className="mb-4">
        <span className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field1">
          DIRECCION
        </span>
        <input
          onChange={handleChange}
          id="field1"
          type="text"
          name='direccion'
          className="text-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field2">
          COMPANIA
        </label>
        <input
          onChange={handleChange}
          id="field2"
          type="text"
          name='compania'
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="field3">
          RIF
        </label>
        <input
          onChange={handleChange}
          id="field3"
          type="text"
          name='rif'
          className="mb-6 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          
        />
      </div>
      <div className="text-right">
        <button
          className="bg-orange-500 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          ENVIAR
        </button>
      </div>
    </form>
        </div>
       
    {/* RESULTADO DE FORMATO */}
    <div className='w-full sm:w-1/2 p-4 border rounded-lg shadow-lg'>
          <h1 className='font-semibold text-center text-xl my-4'>VISTA FORMATO DE FACTURA</h1>
          <p className='text-center font-semibold'>DIRECCION: </p><p className='mb-4 text-center'> {formatoFact && formatoFact[0].direccion}</p>
          <p className='text-center font-semibold'>COMPANIA: </p><p className='mb-4 text-center'>{formatoFact && formatoFact[0].compania}</p>
          <p className='text-center font-semibold'>RIF:</p><p className='mb-4 text-center'>{formatoFact && formatoFact[0].rif}</p>
        </div>
      </div>
      <Formato
      />
      <Facturas
      facturabd={facturabd}
      />
    </Layout>
    
    </>
  )
}

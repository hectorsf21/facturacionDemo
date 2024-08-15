import React from 'react'
import { useState } from 'react'
import axios from "axios";
import Link from 'next/link';

export default function Register() {
    const [data, setData] = useState(
        {
          usuario:'',
          password:''
        }
      )
    
      const handleSubmit = (e)=>{
        e.preventDefault()
        handleSend(data)
      }
    
      const handleSend = async (data)=>{
        try {
        const resp = await axios.post('/api/hello', data)
        console.log(resp.data)
        } catch (error) {
          console.log(error)
        }
      }
    
      const handleChange = (e)=>{
        const {name, value} = e.target
        setData({...data, [name]:value})
      }
  return (
      <>
   <div className="w-1/4 mx-auto mt-40 p-5 rounded shadow-lg">
      <h2 className="text-center text-2xl font-bold mb-4 mt-2">SISTEMA DE FACTURACION</h2>
      <h3 className='text-center text-gray-700 font-medium mb-2 text-xl mt-10'>REGISTRATE</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Usuario:</label>
          <input onChange={handleChange} type="text" name="usuario" className="outline-none mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input onChange={handleChange} type="password" name="password" className="outline-none mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
        </div>
        <div className='flex justify-between items-center'>
            <div className=''>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 px-6 rounded-md">Enviar</button>
            </div>
            <div className=''>
                <Link href='/' className='text-blue-700 underline'>ya tienes una cuenta?</Link>
            </div>
        </div>
      </form>
    </div>
    </>
  )
}

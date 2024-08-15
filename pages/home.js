import React, { useRef } from 'react';
import Layout from './components/Layout'
import TableClient from '@/pages/components/Table_client'
import clientes from '@/models/clientes'
import productos from '@/models/producto'
import formatoModel from '@/models/formato'
import cajerosModel from '@/models/cajeros';
import connectdb from '@/lib/db'
import TableProduct from "@/pages/components/Table_product"
import Factura from './components/Factura'
import MsgExito from './components/MsgExito'
import MsgFail from './components/MsgFail'
// import withAuth from '@/hoc/withAuth';


// SERVER
export const getServerSideProps = async () => {
  try {
      await connectdb()
      // CLIENTES
      const resp = await clientes.find({})
      const cliente = resp.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      // PRODUCTOS
      const respuesta = await productos.find({})
      const producto = respuesta.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      // FORMATO
      const respuest = await formatoModel.find({})
      const formatoM = respuest.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      //CAJEROS
      const respuestCajeros = await cajerosModel.find({})
      const cajeros = respuestCajeros.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      return { props: { cliente, producto, formatoM, cajeros } }
  } catch (err) {
      console.log(err)
      return { props: { cliente: [], producto: [], formatoM: [], cajeros:[] } }
  }

}
// CLOSE SERVER

export default function home({cliente, producto, formatoM, cajeros}) {
  const facturaRef = useRef(null);
  return (
    <>
    <Layout
    cajeros={cajeros}
    >
     <MsgExito
     message={'¡FACTURA GENERADA CORRECTAMENTE!'}
     />
     <MsgFail/>
      <div className='flex flex-wrap justify-around w-full'>
        <div className='w-full md:w-1/2 lg:w-1/2'>
          <TableClient cliente={cliente} />
          <TableProduct facturaRef={facturaRef} producto={producto} />
        </div>
        <div className='w-full md:w-1/2 lg:w-1/2'>
          <Factura
          ref={facturaRef} 
          formatoFact={formatoM}/>
        </div>
      </div>
    </Layout>
    </>
  )
}

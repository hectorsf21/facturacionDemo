import React from 'react'
import Layout from './components/Layout'
import Caja from './components/Caja'
import connectdb from '@/lib/db'
import facturaModel from '@/models/facturas'
import Formato from './components/Formato'

// SERVER
export const getServerSideProps = async () => {
  try {
      await connectdb()
      const respuesta = await facturaModel.find({})
      const facturabd = respuesta.map((e)=>{
        const user = e.toObject()
        user._id = e.id.toString()
        return user
      })
      return { props: {facturabd } }
  } catch (err) {
      console.log(err)
      return { props: {facturabd: [] } }
  }

}
// CLOSE SERVER

export default function caja({facturabd}) {

  return (
    <>
    <Layout>
      <Formato/>
        <Caja
        facturadb={facturabd}
        />
    </Layout>
    </>
  )
}

import React, { useState } from 'react'
import Layout from './components/Layout'
import connectdb from '@/lib/db'
import productoModel from '@/models/producto'
import axios from 'axios'

// SERVER
export const getServerSideProps = async () => {
  try {
    await connectdb()
    const respuesta = await productoModel.find({})
    const initialProducto = respuesta.map((e) => {
      const user = e.toObject()
      user._id = e._id.toString()
      return user
    })

    return { props: { initialProducto } }
  } catch (err) {
    console.log(err)
    return { props: { initialProducto: [] } }
  }
}
// CLOSE SERVER

export default function Productos({ initialProducto }) {
  const [products, setProducts] = useState(initialProducto)
  const [productNew, setProductNew] = useState({
    nombre: '',
    gramos: '',
    precio: ''
  })
  const [editingProducto, setEditingProducto] = useState(null)

  const handleChange = (e) => {
    setProductNew({ ...productNew, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingProducto) {
      // Editar producto
      try {
        const res = await axios.put('/api/productos/edit', {...productNew, id: editingProducto._id,})
        const updatedProduct = res.data
        setProducts(products.map(product => product._id === updatedProduct._id ? updatedProduct : product))
        setEditingProducto(null)
        setProductNew({ nombre: '', gramos: '', precio: '' })
      } catch (error) {
        console.error('Error al editar el producto', error)
      }
    } else {
      // Crear producto
      try {
        const res = await axios.post('/api/productos/create', productNew)
        const newProduct = res.data
        setProducts([...products, newProduct])
        setProductNew({ nombre: '', gramos: '', precio: '' })
      } catch (error) {
        console.error('Error al crear el producto', error)
      }
    }
  }

  const handleEdit = (product) => {
    setEditingProducto(product)
    setProductNew({ nombre: product.nombre, gramos: product.gramos, precio: product.precio })
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/productos/eliminar', {
        data: { _id: id },
      })
      setProducts(products.filter(product => product._id !== id))
    } catch (error) {
      console.error('Error al eliminar el producto', error)
    }
  }

  return (
    <>
      <Layout>
        <div className="w-full sm:w-1/2 mx-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={productNew.nombre}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Gramos</label>
              <input
                type="text"
                name="gramos"
                value={productNew.gramos}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Precio</label>
              <input
                type="text"
                name="precio"
                value={productNew.precio}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded">
              {editingProducto ? "Actualizar Producto" : "Agregar Producto"}
            </button>
          </form>

          <div className="overflow-x-auto">
  <table className="min-w-full mt-8 bg-white rounded shadow-md">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Nombre</th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Gramaje</th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Precio</th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Editar</th>
        <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Eliminar</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {products.map((product) => (
        <tr key={product._id}>
          <td className="px-6 py-4 border-b border-gray-200">{product.nombre}</td>
          <td className="px-6 py-4 border-b border-gray-200">{product.gramos}</td>
          <td className="px-6 py-4 border-b border-gray-200">{product.precio}Bs</td>
          <td className="px-6 py-4 border-b border-gray-200">
            <button onClick={() => handleEdit(product)} className="text-blue-500">Editar</button>
          </td>
          <td className="px-6 py-4 border-b border-gray-200">
            <button onClick={() => handleDelete(product._id)} className="text-red-500">Eliminar</button>
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

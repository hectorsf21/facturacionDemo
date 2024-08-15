import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-orange-500 border-opacity-75"></div>
      <p className="mt-4 text-lg text-gray-600">Cargando...</p>
    </div>
  </div>
  )
}

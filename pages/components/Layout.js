import React from 'react'
import Nav from './Nav'
import { useTask } from '@/context/TaskContext'
export default function Layout({children, cajeros}) {
  // console.log(cajeros)
  const {total, devo, dolar} = useTask()
  return (
    <>
    <div className='bg-black'>
        <div className='flex min-h-screen '>
        <Nav
        cajeros={cajeros}
        />
          <div className='bg-white w-full'>
            <div className='flex items-center justify-around p-5 p-5 bg-black w-full h-20'>
              <h1 className='text-right sm:text-sm lg:text-4xl text-white'>DEVOLUCION: {isNaN(devo) ? 0 : devo}BS / {isNaN(devo) ? 0 :(devo/dolar).toFixed(1)}$ </h1>
              <h1 className='text-right sm:text-sm lg:text-4xl text-white'>TOTAL: {total && total.toFixed(2)}BS / {total && (total.toFixed(2)/dolar).toFixed(1)}$</h1>
            </div>
            <div className='p-2'>
               {children}
            </div>
           
           </div>
        </div>
      </div>
    </>
  )
}

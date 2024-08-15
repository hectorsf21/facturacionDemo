import React from 'react'
import { useTask } from '@/context/TaskContext'

export default function Delete({message}) {
    const {displayModal, setDisplayModal, deleteObject, setDeleteObject} = useTask()
    const handleDeleteClick = ()=>{
        setDeleteObject(!deleteObject)
        setDisplayModal(!displayModal)
        window.location.reload();
    }
    const handleResetClick = ()=>{
        setDisplayModal(!displayModal)
        
    }
  return (
    <>
     <div className={displayModal ?`fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50`:`hidden`}>
      <div className="w-1/4 lg:w-[630px] bg-white transform transition-transform duration-500 ease-in-out translate-y-full animate-fadeInUp">
        <div className="bg-red-200 mb-12 h-10 w-full"></div>
        <h1 className="font-semibold text-2xl text-center">{message}</h1>
        <div className='flex justify-around items-center'>
        <div className="text-center my-12">
            <button onClick={handleDeleteClick} className="bg-red-700 px-6 py-2 text-white rounded-md">SI</button>
        </div>
        <div className="text-center my-12">
            <button onClick={handleResetClick} className="bg-green-700 px-6 py-2 text-white rounded-md">NO</button>
        </div>
        </div>
       
      </div>
    </div>
    </>
  )
}

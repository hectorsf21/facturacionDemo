import React from 'react';
import { useTask } from '@/context/TaskContext';

export default function MsgExito({ message }) {
  const { displayModal, setDisplayModal } = useTask();

  const handleClick = () => {
    setDisplayModal(!displayModal);
    window.location.reload();
  };

  return (
    <div className={displayModal ? `fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50` : `hidden`}>
      <div className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-[630px] bg-white transform transition-transform duration-500 ease-in-out translate-y-full animate-fadeInUp rounded-lg shadow-lg">
        <div className="bg-green-200 mb-8 h-10 w-full rounded-t-lg"></div>
        <h1 className="font-semibold text-lg sm:text-xl md:text-2xl text-center px-4">{message}</h1>
        <div className="text-center my-8">
          <button onClick={handleClick} className="bg-green-700 px-6 py-2 text-white rounded-md hover:bg-green-800 transition-colors duration-300">
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useTask } from '@/context/TaskContext';

export default function Formato() {
    const { closetFormat, setCloseFormat, facturaSelect } = useTask();
    
    const handleImprimir = () => {
        // Función para manejar la impresión
    }

    const handleCloset = () => {
        setCloseFormat(!closetFormat);
    }

    return (
        <div className={closetFormat ? `block fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20` : `hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl overflow-y-auto max-h-[80vh] sm:max-h-[90vh] h-[80vh] sm:h-[90vh]">
                <h1 className="text-2xl sm:text-3xl text-center font-bold mb-4">FACTURA</h1>

                {/* Información del Encabezado */}
                <div className="mb-4 text-sm sm:text-base">
                    <p className="font-semibold text-center">RIF J-{facturaSelect && facturaSelect.formato[0].rif}</p>
                    <p className="font-semibold text-center">{facturaSelect && facturaSelect.formato[0].compania.toUpperCase()}</p>
                    <p className="font-semibold text-center">{facturaSelect && facturaSelect.formato[0].direccion.toUpperCase()}</p>
                </div>

                {/* Información del Cliente */}
                <div className="mb-4 text-sm sm:text-base">
                    <span className="font-semibold">Razon social: </span><span>{facturaSelect && facturaSelect.cliente.nombres}</span><br/>
                    <span className="font-semibold">Rif/CI: </span><span>{facturaSelect && facturaSelect.cliente.cedula}</span>
                </div>

                <div className="grid grid-cols-2 pt-8 text-sm sm:text-base">
                    <p className="font-bold col-start-1">Factura:</p>
                    <p className="text-right col-start-2">{facturaSelect && facturaSelect.numero}</p>
                </div>
                <div className="grid grid-cols-2 text-sm sm:text-base">
                    <p className="font-bold col-start-1">Fecha: {facturaSelect && facturaSelect.fecha}</p>
                    <p className="text-right col-start-2">{facturaSelect && facturaSelect.hora}</p>
                </div>

                {/* Tabla de Items */}
                <div className="mb-4">
                    <table className="min-w-full bg-white text-sm sm:text-base">
                        <thead>
                            <tr>
                                <th className="py-2 text-left">Descripción</th>
                                <th className="py-2 text-left"></th>
                                <th className="py-2 text-right">Precio Unitario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturaSelect && facturaSelect.productos.map((e, index) => (
                                <tr key={index}>
                                    <td className="py-2">{e.nombre} {e.gramos}g</td>
                                    <td className="py-2">----------------------------</td>
                                    <td className="py-2 text-right">{e.precio}BS</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="grid grid-cols-2 border-t-2 border-gray-300 pt-4">
                    <p className="text-lg sm:text-xl font-bold col-start-1">Total:</p>
                    <p className="text-lg sm:text-xl font-bold text-right col-start-2">{facturaSelect && facturaSelect.total}</p>
                </div>
                <div className="flex justify-between mt-6">
                    <div>
                        <button onClick={handleImprimir} className="rounded-md bg-green-600 text-white px-4 sm:px-6 py-2">IMPRIMIR</button>
                    </div>
                    <div>
                        <button onClick={handleCloset} className="rounded-md bg-red-600 text-white px-4 sm:px-6 py-2">CERRAR</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { useTask } from '@/context/TaskContext';
import axios from 'axios';

export default function Caja({ facturadb }) {
  console.log(facturadb)
  const { dolar, setDolar, setFacturaSelect, closetFormat, setCloseFormat } = useTask();

  const [selectedField, setSelectedField] = useState('');
  const [formData, setFormData] = useState({
    ingresoEfectivo: '',
    salidaEfectivo: '',
    ingresoPunto: '',
    salidaPunto: '',
    comentario: '',
  });
  const [caja, setCaja]= useState({
    devolucion:{
      devolucionEfectivo:'',
      devolucionPunto:''
    },
    mPago:{
      montoEfectivo:'',
      montoPunto:'',
      tipoPago:''
    },
    fecha:'',
    hora:''
  })
  const [totalEntradaEfectivo, setTotalEntradaEfectivo] = useState(0);
  const [totalEntradaPunto, setTotalEntradaPunto] = useState(0);
  const [totalMontoTotal, setTotalMontoTotal] = useState(0);
  const [totalEnVentas, setTotalEnVentas] = useState(0)
  // const [entradaCaja, setEntradaCaja] = useState(0)

  const handleSelectionChange = (e) => {
    setSelectedField(e.target.value);
  };

  // FUNCION PARA GENERAR FECHA Y HORA
  const getCurrentDateTime = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(); // Ejemplo: "31/07/2024"
    // Obtención de la hora en formato de 12 horas con AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // El valor de las 12 horas es "12" en vez de "0"
  
  const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

  return { date: formattedDate, time: formattedTime };
  };


  // CAPTURAS DE DATOS
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Determinar el símbolo de la moneda
    let formattedValue = value;
    if (selectedField === 'ingresoEnBs' || selectedField === 'salidaBs' || selectedField === 'salidaPunto' || selectedField === 'entradaPunto') {
      formattedValue = `${parseFloat(value) || 0} BS`;
    } else if (selectedField === 'ingresoEn$' || selectedField === 'salida$') {
      formattedValue = `${parseFloat(value) || 0}$`;
    }
    
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  
    if (selectedField === 'ingresoEnBs' || selectedField === 'ingresoEn$') {
      setCaja(prevCaja => ({
        ...prevCaja,
        mPago: {
          ...prevCaja.mPago,
          montoEfectivo: formattedValue // Aquí se guarda el valor formateado
        }
      }));
    }
  
    if (selectedField === 'salidaBs' || selectedField === 'salida$') {
      setCaja(prevCaja => ({
        ...prevCaja,
        devolucion: {
          ...prevCaja.devolucion,
          devolucionEfectivo: formattedValue // Aquí se guarda el valor formateado
        }
      }));
    }
  
    if (selectedField === 'salidaPunto') {
      const monto = parseFloat(value) || 0;
      setCaja(prevCaja => ({
        ...prevCaja,
        devolucion: {
          ...prevCaja.devolucion,
          devolucionPunto: formattedValue
        }
      }));
    }
  
    if (selectedField === 'entradaPunto') {
      const monto = parseFloat(value) || 0;
      setCaja(prevCaja => ({
        ...prevCaja,
        mPago: {
          ...prevCaja.mPago,
          montoPunto: formattedValue
        }
      }));
    }
  
    if(name === 'tipoPago'){
      setCaja({...caja, mPago:{...caja.mPago, tipoPago:value}})
    }
  };
  


// ENVIAR DATOS
const handleSubmit = async(e)  => {
  e.preventDefault();
  const { date, time } = getCurrentDateTime();

  // Crear una copia local del objeto caja con la fecha y la hora actualizadas
  const cajaConFechaHora = {
      ...caja,
      fecha: date,
      hora: time
  };

  try {
    const resp = await axios.post('/api/factura', { caja: cajaConFechaHora });
    console.log(resp);
    window.location.reload(); 
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
    const savedDolar = localStorage.getItem('dolar');
    if (savedDolar) {
      setDolar(parseFloat(savedDolar));
    }
  }, [setDolar]);

  useEffect(() => {
    if (facturadb) {
      let totalEfectivo = 0;
      let totalPunto = 0;
      let totalMonto = 0;
      let entradaTotal = 0;

      facturadb.forEach((factura) => {
        const ingresoEfectivo = convertirMonto(factura.factura.mPago.montoEfectivo);
        const salidaEfectivo = convertirMonto(factura.factura.devolucion.devolucionEfectivo);
        const entradaEfectivo = ingresoEfectivo - salidaEfectivo;

        const ingresoPunto = convertirMonto(factura.factura.mPago.montoPunto);
        const salidaPunto = convertirMonto(factura.factura.devolucion.devolucionPunto);
        const entradaPunto = ingresoPunto - salidaPunto;
        

        const totalVentas = convertirMonto(factura.factura.total)
        const montoTotal = entradaEfectivo + entradaPunto
        
        totalEfectivo += entradaEfectivo;
        totalPunto += entradaPunto;
        totalMonto += montoTotal;
        entradaTotal += totalVentas
      });

      setTotalEntradaEfectivo(totalEfectivo);
      setTotalEntradaPunto(totalPunto);
      setTotalMontoTotal(totalMonto);
      setTotalEnVentas(entradaTotal);

    }
  }, [facturadb, dolar]);


// MAGIA
  const convertirMonto = (monto) => {
    if (typeof monto !== 'string') {
      // Si el monto no es una cadena, conviértelo en una cadena vacía
      monto = String(monto || '');
    }
  
    if (monto.endsWith('BS')) {
      return parseFloat(monto.replace('BS', '').trim()) / dolar;
    } else if (monto.endsWith('$')) {
      return parseFloat(monto.replace('$', '').trim()) * 1;
    }
    return 0;
  };
  

  const handleSelect = (e) => {
    setFacturaSelect(e);
    setCloseFormat(!closetFormat);
  };

  


  return (
    <div className="flex justify-center overflow-x-auto w-full">
      <div className="w-full">
        <h1 className='text-3xl font-bold text-center py-12'>CAJA</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12 p-4 border rounded-lg shadow-lg">
          <h1 className='font-semibold text-center text-xl my-6'>GESTION DE CAJA</h1>


          {/* SELECTOR */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="select-field">
              Selecciona un campo
            </label>
            <select
              id="select-field"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedField}
              onChange={handleSelectionChange}
            >
              <option value="">Seleccionar...</option>
              <option value="ingresoEnBs">INGRESO EN BS</option>
              <option value="ingresoEn$">INGRESO EN $</option>
              <option value="salidaBs">SALIDA BS</option>
              <option value="salida$">SALIDA $</option>
              <option value="salidaPunto">SALIDA POR PUNTO</option>
              <option value="entradaPunto">ENTRADA POR PUNTO</option>
            </select>
          </div>

          {selectedField && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={selectedField}>
                {selectedField.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </label>
              <input
                onChange={handleChange}
                id={selectedField}
                type="text"
                name={selectedField}
                value={formData[selectedField]}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comentario">
              Comentario
            </label>
            <input
              onChange={handleChange}
              id="comentario"
              type="text"
              name="tipoPago"
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
        <span className='font-bold text-2xl'>CAPITAL EN CAJA:</span> <span className='text-2xl'>{totalMontoTotal.toFixed(2)}$ / {(totalMontoTotal.toFixed(2)*dolar).toFixed(2)}BS</span><br/><br/>
        <span className='font-bold text-2xl'>MONTO EFECTIVO:</span> <span className='text-2xl'>{totalEntradaEfectivo.toFixed(2)}$ / {(totalEntradaEfectivo.toFixed(2)*dolar).toFixed(2)}BS</span><br/><br/>
        <span className='font-bold text-2xl'>MONTO PUNTO DE VENTA:</span> <span className='text-2xl'>{totalEntradaPunto.toFixed(2)}$ / {(totalEntradaPunto.toFixed(2)*dolar).toFixed(2)}BS</span><br/><br/>
        <span className='font-bold text-2xl'>FACTURADO EN VENTAS:</span> <span className='text-2xl'>{totalEnVentas.toFixed(2)}$ / {(totalEnVentas.toFixed(2)*dolar).toFixed(2)}BS</span>

        {/* TABLA */}
        <div className='max-h-60 overflow-y-auto mt-10'>
        <table className="w-full mt-10 text-center bg-white shadow-md rounded-lg">
          <thead className='bg-orange-500 text-white sticky top-0 z-10'>
            <tr className="">
              <th className="px-4 py-2">FECHA Y HORA</th>
              <th className="px-4 py-2">TIPO DE PAGO</th>
              <th className="px-4 py-2">INGRESO EFECTIVO</th>
              <th className="px-4 py-2">SALIDA EFECTIVO</th>
              <th className="px-4 py-2">ENTRADA EFECTIVO</th>
              <th className="px-4 py-2">INGRESO PUNTO</th>
              <th className="px-4 py-2">SALIDA PUNTO</th>
              <th className="px-4 py-2">ENTRADA PUNTO</th>
              <th className="px-4 py-2">MONTO TOTAL</th>
              <th className="px-4 py-2">FACTURA</th>
            </tr>
          </thead>
          <tbody>
            {facturadb && facturadb.map((factura, index) => {
              // Calcular entrada efectivo
              const ingresoEfectivo = convertirMonto(factura.factura.mPago.montoEfectivo);
              const salidaEfectivo = convertirMonto(factura.factura.devolucion.devolucionEfectivo);
              const entradaEfectivo = ingresoEfectivo - salidaEfectivo;

              // Calcular entrada punto
              const ingresoPunto = convertirMonto(factura.factura.mPago.montoPunto);
              const salidaPunto = convertirMonto(factura.factura.devolucion.devolucionPunto);
              const entradaPunto = ingresoPunto - salidaPunto;

              // Calcular monto total
              const montoTotal = convertirMonto(factura.factura.total);

              return (
                <tr key={index}>
                  <td className="px-4 py-2">
                    {factura.factura.fecha} {factura.factura.hora}
                  </td>
                  {/* TIPO DE PAGO */}
                  <td className="px-4 py-2">
                    {factura.factura.mPago.tipoPago}
                  </td>
                  {/* INGRESO EFECTIVO */}
                  <td className="px-4 py-2">
                    {factura.factura.mPago.montoEfectivo}
                  </td>
                  {/* SALIDA EFECTIVO */}
                  <td className="px-4 py-2">
                    {factura.factura.devolucion.devolucionEfectivo}
                  </td>
                  {/* ENTRADA EFECTIVO */}
                  <td className="px-4 py-2">{entradaEfectivo.toFixed(2)}$</td>
                  {/* INGRESO PUNTO */}
                  <td className="px-4 py-2">
                    {factura.factura.mPago.montoPunto}
                  </td>
                  {/* SALIDA PUNTO */}
                  <td className="px-4 py-2">
                    {factura.factura.devolucion.devolucionPunto}
                  </td>
                  {/* ENTRADA PUNTO */}
                  <td className="px-4 py-2">{entradaPunto.toFixed(2)}$</td>
                  {/* MONTO TOTAL */}
                  <td className="px-4 py-2">
                    {factura?.factura?.total
                      ? factura.factura.total
                      : entradaEfectivo
                      ? `${entradaEfectivo.toFixed(2)}$`
                      : `${entradaPunto.toFixed(2)}$`}
                    {typeof factura?.factura?.total === "string" &&
                    !isNaN(parseFloat(factura.factura.total)) ? (
                      <span>
                        {" "}
                        {(parseFloat(factura.factura.total) / dolar).toFixed(2)}
                        $
                      </span>
                    ) : (
                      <span>{""}</span>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleSelect(factura.factura)}
                      className="text-white bg-black rounded-md px-4 py-2"
                    >
                      {factura.factura.numero
                        ? factura.factura.numero
                        : "NO FACTURA"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, forwardRef } from 'react';
import { useTask } from '@/context/TaskContext'
import connectdb from '@/lib/db'
import axios from 'axios'
import MsgRefer from './MsgRefer'

// SERVER
export const getServerSideProps = async () => {
  try {
      await connectdb()
      const resp = await formatoModel.find({})
      const formatoFact = resp.map((e) => {
          const user = e.toObject()
          user._id = e._id.toString()
          return user
      })
      return { props: { formatoFact } }
  } catch (err) {
      console.log(err)
      return { props: { formatoFact: [] } }
  }

}
// CLOSE SERVER

const Factura = forwardRef(({formatoFact}, ref) => {
  const {displayRefer, setDisplayRefer, dolar, setDolar, displayModalError, setDisplayModalError, displayModal, setDisplayModal, devo, setDevo, client, product, setProducto, total, setTotal} = useTask()
  const [ing, setIng] = useState()
  const [ing2, setIng2] = useState()
  const [conversion, setConversion] = useState(false)
  const [devoConversion, setDevoConversion] = useState(false)

  // SI CONVERSION ES FALSO = BS
  // SI CONVERSION ES VERDADERO = $


  // ESTADOS PARA LOS SELECTORES
  const [pago, setPago] = useState({
    tipoPago:'',
    montoPunto:'',
    montoEfectivo:''
  })
  const [vuelto, setVuelto] = useState({
    tipoDevolucion:'',
    devolucionPunto:'',
    devolucionEfectivo:''
  })

  useEffect(() => {
    setTotal(product.reduce((acc, e) => acc + parseFloat(e.precio), 0));
  }, [product, setTotal]);


  useEffect(() => {
    const sumaPagos = parseFloat(ing || 0) + parseFloat(ing2 || 0);
    
    if (total === 0 || sumaPagos === 0) {
      setDevo(0);
    } else if (conversion) {
      setDevo(((sumaPagos * dolar) - total).toFixed(0));
    } else {
      setDevo((sumaPagos - total).toFixed(0));
    }
  }, [ing, ing2, total, setDevo, conversion, dolar]);
  

  const handleRemove = (index) => {
    setProducto(product.filter((_, i) => i !== index));
  };

  // FUNCION PARA NUMERO ALEATORIO
  const generateInvoiceNumber = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Convertir fecha y hora en un número
    const timeBasedNumber = hours * 3600 + minutes * 60 + seconds; // Convertir todo a segundos
  
    // Generar un número aleatorio adicional entre 0 y 9999
    const randomPart = Math.floor(Math.random() * 10000);
  
    // Sumar el número basado en tiempo y el número aleatorio
    const combinedNumber = timeBasedNumber + randomPart;
  
    // Obtener los últimos 5 dígitos
    const lastFiveDigits = combinedNumber.toString().slice(-5);
  
    // Concatenar con '000' al principio para completar 8 dígitos
    return `000${lastFiveDigits}`;
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
  
  

  // FUNCION PARA GENERAR FACTURA
  const handleFactura = ()=>{
    if (!pago.tipoPago) {
      alert('Por favor, seleccione un tipo de pago antes de generar la factura.');
      return;
    }
  
    // Verifica si se ingresó el monto de pago si el tipo de pago es "punto" o "efectivo"
    if ((pago.tipoPago === 'punto' && !pago.montoPunto) ||
        (pago.tipoPago === 'efectivo' && !pago.montoEfectivo) ||
        (pago.tipoPago === 'punto_y_efectivo' && (!pago.montoPunto || !pago.montoEfectivo))) {
      alert('Por favor, ingrese el monto correspondiente para el tipo de pago seleccionado.');
      return;
    }
  
    // Verifica si se ha seleccionado un tipo de devolución si el monto de devolución es positivo
    if (devo > 0 && !vuelto.tipoDevolucion) {
      alert('Por favor, seleccione un tipo de devolución antes de generar la factura.');
      return;
    }

    const avoicenumber = generateInvoiceNumber()
    const { date, time } = getCurrentDateTime();
    const factur = {
      cliente:client,
      productos:product,
      total:total.toFixed(2)+'BS',
      fecha:date,
      hora:time,
      numero:avoicenumber,
      formato:formatoFact,
      mPago:pago,
      devolucion:vuelto
    }
    handleSendFactura(factur) 
  }
  const handleSendFactura = async (factur)=>{
    try {
      const resp = await axios.post('/api/factura', {factur})
      console.log(resp.data.message)
      if(resp.data.message === 'Datos enviados con éxito'){
        setDisplayModal(!displayModal)
      }
    } catch (error) {
      setDisplayModalError(!displayModalError)
      console.log(error)

    }
  }
 
  
  // FUNCIONES PARA LOS SELECTORES
  const handleTipoPagoChange = (e) => {
    const {value} =  e.target
    if(value ==='punto'){
      setConversion(false)
    }
    if(value ==='efectivo en BS'){
      setConversion(false)
    }
    if(value ==='efectivo en $'){
      setConversion(true)
    }
    if(value ==='punto y efectivo en BS'){
      setConversion(false)
    }
    setPago({...pago, tipoPago:value})

    if(value != pago.tipoPago){
      setPago({ tipoPago: value, montoPunto: '', montoEfectivo: '' });
    }
  };

const handleMontoPago2 = (e)=>{
  const { name, value } = e.target;
  let montoConMoneda = value;
  setIng2(value)
  if (conversion) {
    // Si ya tiene el símbolo '$', no agregarlo de nuevo
    if (!montoConMoneda.includes('$')) {
      montoConMoneda = `${value}$`;
    }
  } else {
    // Si ya tiene el símbolo 'BS', no agregarlo de nuevo
    if (!montoConMoneda.includes('BS')) {
      montoConMoneda = `${value}BS`;
    }
  } 
  setPago({ ...pago, [name]: montoConMoneda });
}


// MONTO DE PAGO
  const handleMontoPago = (e) => {
    const { name, value } = e.target;
    let montoConMoneda = value;
    setIng(value)
    if (conversion) {
      // Si ya tiene el símbolo '$', no agregarlo de nuevo
      if (!montoConMoneda.includes('$')) {
        montoConMoneda = `${value}$`;
      }
    } else {
      // Si ya tiene el símbolo 'BS', no agregarlo de nuevo
      if (!montoConMoneda.includes('BS')) {
        montoConMoneda = `${value}BS`;
      }
    } 
    setPago({ ...pago, [name]: montoConMoneda });
  };

  // TIPO DE DEVOLUCION
  const handleTipoDevolucionChange = (e) => {
    const {value} = e.target
    if(value === 'devolucion_punto'){
      setDevoConversion(false)
    }
    if(value === 'devolucion efectivo en Bs'){
      setDevoConversion(false)
    }
    if(value === 'devolucion efectivo en $'){
      setDevoConversion(true)
    }
    if(value === 'devolucion_punto_y_efectivo'){
      setConversion(false)
    }
    setVuelto({...vuelto, tipoDevolucion:value})
    if(value != vuelto.tipoDevolucion){
      setVuelto({ tipoDevolucion: value, devolucionPunto: '', devolucionEfectivo: '' });
    }
  };
   // MONTO DE DEVOLUCION
   const handleMontoDevolucion = (e) => {
    const { name, value } = e.target;
    let montoConMoneda = value;
    if (devoConversion) {
      montoConMoneda = `${value}$`;
    } else {
      montoConMoneda = `${value}BS`;
    }
    setVuelto({ ...vuelto, [name]: montoConMoneda });
  };

  // ACTUALIZACION DEL DOLAR
  useEffect(() => {
    const savedDolar = localStorage.getItem('dolar');
    if (savedDolar) {
      setDolar(parseFloat(savedDolar));
    }
  }, [setDolar]);

  const handleDolar = (e) => {
    let { value } = e.target;
    value = value.replace(',', '.');
    setDolar(parseFloat(value)); 
  };
  
  
  

  const handleChangeDolar = (e)=>{
    e.preventDefault()
    localStorage.setItem('dolar', dolar);
    setDisplayRefer(!displayRefer)
  }


// CONVERSIONES
  const handleConversionBs = (e)=>{
    e.preventDefault()
    setConversion(false)
  }
  const handleConversionDolar = (e)=>{
    e.preventDefault()
    setConversion(true)
  }
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const handleConversionBs2 = (e)=>{
    e.preventDefault()
    setConversionMontoDos(false)
  }

  const handleConversionDolar2 = (e)=>{
    e.preventDefault()
    setConversionMontoDos(true)
  }
  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const handleConversionBs3 = (e)=>{
    e.preventDefault()
    setConversionMontoTres(false)
  }

  const handleConversionDolar3 = (e)=>{
    e.preventDefault()
    setConversionMontoTres(true)
  }
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  const handleConversionBs4 = (e)=>{
    e.preventDefault()
    setConversionMontoCuatro(false)
  }

  const handleConversionDolar4 = (e)=>{
    e.preventDefault()
    setConversionMontoCuatro(true)
  }
  return (
    <>
    <MsgRefer
    message={'REFERENCIA CAMBIADA CON EXITO'}
    />
      <div className='mt-4 relative w-full border border-2 justify-center mb-6'>
        {/* CAJA */}
      <form className='p-2'>
        <div className='flex justify-end items-center text-right'> 
        <label className='font-bold mr-2'>REFERENCIA </label>
        <label className='font-bold text-green-600'> $</label>
        <span>{dolar}</span>
        <input 
        onChange={handleDolar} 
        name='dolar'
        className='w-1/4 ml-4 shadow appearance-none border border-green-600 rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
        type='text'
        placeholder='cambiar refe.'
        />
        <div className=''>
          <button onClick={handleChangeDolar} className='rounded-md border border-green-600 px-4 py-2'>Cambiar</button>
        </div>
        </div>
        
        <h1 className='text-center font-bold text-2xl p-2 mb-4'>CAJA</h1>

        <label>TIPO DE PAGO:</label><br/>
        <select onChange={handleTipoPagoChange} className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'>
          <option value=''>Seleccione</option>
          <option value='punto'>Punto de Venta</option>
          <option value='efectivo en BS'>Efectivo en bs</option>
          <option value='efectivo en $'>Efectivo en dolares</option>
          <option value='punto y efectivo en BS'>Punto y Efectivo en bs</option>
        </select><br/><br/>

        {pago.tipoPago === 'punto' && (
          <div>
            
            <label>MONTO PUNTO DE VENTA:</label><br/>
            <input
              type='number'
              name='montoPunto'
              onChange={handleMontoPago}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='colocar monto en bolivares'
            /><br/><br/>
          </div>
        )}

{pago.tipoPago === 'efectivo en BS' && (
  <div>
    <label>MONTO EN BS:</label>
    <br/>
    <div className='relative w-full sm:w-1/2'>
      <input
        type='number'
        name='montoEfectivo'
        onChange={handleMontoPago}
        className='shadow appearance-none border rounded py-2 px-3 pr-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        placeholder={`Ingrese el monto en Bs`}
      />
    </div><br/><br/>
  </div>
)}

{pago.tipoPago === 'efectivo en $' && (
  <div>
    <label>MONTO EN $:</label>
    <br/>
    <div className='relative w-full sm:w-1/2'>
      <input
        type='number'
        name='montoEfectivo'
        onChange={handleMontoPago}
        className='shadow appearance-none border rounded py-2 px-3 pr-12 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        placeholder={'ingrese el monto en $'}
      />
    </div><br/><br/>
  </div>
)}


        {pago.tipoPago === 'punto y efectivo en BS' && (
          <div>
            <label>MONTO PUNTO DE VENTA:</label><br/>
            <input
              type='number'
              name='montoPunto'
              onChange={handleMontoPago}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            /><br/><br/>

            <label>MONTO EN BS:</label><br/>
            <input
              type='text'
              name='montoEfectivo'
              onChange={handleMontoPago2}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder={'Ingrese el monto en Bs'}
              /> 
              <br/><br/>
             
          </div>
        )}

        <label>TIPO DE DEVOLUCIÓN:</label><br/>
        <select onChange={handleTipoDevolucionChange} className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'>
          <option value=''>Seleccione</option>
          <option value='devolucion_punto'>Devolución por Punto</option>
          <option value='devolucion efectivo en Bs'>Devolución en Bs</option>
          <option value='devolucion efectivo en $'>Devolución en $</option>
          <option value='devolucion_punto_y_efectivo'>Devolución por Punto y Efectivo en Bs</option>
        </select><br/><br/>

        {vuelto.tipoDevolucion === 'devolucion_punto' && (
          <div>
            <label>DEVOLUCIÓN PUNTO DE VENTA:</label><br/>
            <input
              type='number'
              name='devolucionPunto'
              onChange={handleMontoDevolucion}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            /><br/><br/>
          </div>
        )}

        {vuelto.tipoDevolucion === 'devolucion efectivo en Bs' && (
          <div>
            <label>DEVOLUCION EN BS:</label><br/>
            <input
              type='text'
              name='devolucionEfectivo'
              onChange={handleMontoDevolucion}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder={`Ingrese monto en Bs`}
            />
            <br/><br/>
          </div>
        )}

        {vuelto.tipoDevolucion === 'devolucion efectivo en $' && (
          <div>
            <label>DEVOLUCIÓN EN $:</label><br/>
            <input
              type='number'
              name='devolucionEfectivo'
              onChange={handleMontoDevolucion}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder='ingrese monto en $'
            /><br/><br/>
          </div>
        )}

        {vuelto.tipoDevolucion === 'devolucion_punto_y_efectivo' && (
          <div>
            <label>DEVOLUCIÓN PUNTO DE VENTA:</label><br/>
            <input
              type='number'
              name='devolucionPunto'
              onChange={handleMontoDevolucion}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            /><br/><br/>

            <label>DEVOLUCIÓN EFECTIVO:</label><br/>
            <input
              type='text'
              name='devolucionEfectivo'
              onChange={handleMontoDevolucion}
              className='shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              placeholder={`Ingrese el monto en Bs`}
            />
            <br/><br/>
          </div>
        )}  

        <span className='font-bold'>MONTO A PAGAR:</span> <span>{total && total.toFixed(2)}BS  {total &&(total.toFixed(0)/dolar).toFixed(1)}$</span><br/>
        <span className='font-bold'>DEVOLUCION:</span> <span>{isNaN(devo) ? 0 : devo}BS {isNaN(devo) ? 0 :(devo/dolar).toFixed(1)}$</span><br/>
      </form>
    </div>
    {/* FACTURA */}
    <div ref={ref} className='w-full border border-2 justify-center'>
        <h1 className='text-center font-bold text-2xl p-2'>FACTURA</h1>
        <h3 className='text-center font-bold'>RIF J-{formatoFact ? formatoFact[0].rif.toUpperCase() : '' }</h3>
        <h3 className='text-center font-bold'>{formatoFact && formatoFact[0].compania.toUpperCase()}</h3>
        <h3 className='text-center font-bold'>{formatoFact && formatoFact[0].direccion.toUpperCase()}</h3>
          <div className='p-2'>
            <span className='font-semibold'>RAZON SOCIAL: </span><span>{client.nombres && client.nombres.toUpperCase()}</span><br/>
            <span className='font-semibold'>RIF/C.I: </span><span>{client.cedula && client.cedula.toUpperCase()}</span>
          </div>
          <table className='w-full border border-0'>
        <tbody>
          {product && product.map((e, index) => (
            <tr key={index} className='text-center'>
              <td className='p-2'>
                {e.nombre} - {e.gramos}MG
              </td>
              <td className='p-2'>{e.precio}BS</td>
              <td className='p-2'>
                <button 
                  onClick={() => handleRemove(index)} 
                  className='bg-red-500 text-white p-1 rounded hover:bg-red-700'
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='px-2 font-bold bg-gray-200 w-full border flex justify-between'>
          <p>TOTAL</p>
          <p>{total && total.toFixed(2)}BS</p>
        </div>
        <div className='px-2 font-bold bg-gray-200 w-full border flex justify-between'>
          <p></p>
          <p>{total && (total.toFixed(2)/dolar).toFixed(1)}$</p>
        </div>  
    </div>
    <div className='text-right'>
      <button onClick={handleFactura} className='hover:bg-black mt-4 px-4 py-2 rounded bg-green-600 text-white'>GENERAR</button>
    </div>
    </>
  )
})

export default Factura

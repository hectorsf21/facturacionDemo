import { createContext, useContext, useEffect, useState } from "react";

export const TaskContext = createContext()

export const useTask = () => useContext(TaskContext)

export const TaskProvider = ({children}) =>{
    const [client, setClient] = useState([])
    const [product, setProducto] = useState([])
    const [factura, setFactura] = useState([])
    const [total, setTotal] = useState()
    const [devo, setDevo] = useState()
    const [displayModal, setDisplayModal] = useState(false)
    const [displayModalError, setDisplayModalError] = useState(false)
    const [closetFormat, setCloseFormat] = useState(false)
    const [facturaSelect, setFacturaSelect] = useState()
    const [dolar, setDolar] = useState()
    const [deleteObject, setDeleteObject] = useState(false)
    const [displayRefer, setDisplayRefer] = useState(false)

    
        
    return <TaskContext.Provider value={{displayRefer, setDisplayRefer, deleteObject, setDeleteObject, dolar, setDolar, facturaSelect, setFacturaSelect, closetFormat, setCloseFormat, displayModalError, setDisplayModalError, displayModal, setDisplayModal, devo, setDevo, total, setTotal, factura, setFactura, setProducto, product, client, setClient}}>{children}</TaskContext.Provider>
}
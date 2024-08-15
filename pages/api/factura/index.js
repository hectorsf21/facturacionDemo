import connectdb from "@/lib/db";
import facturasModel from "@/models/facturas";

export default async function handler(req, res) {
    try {
        // Conectar a la base de datos
        await connectdb();

        // Obtener los valores de la solicitud
        const { factur, caja } = req.body;

        // Verificar si existe factur, si no, utilizar caja
        const data = factur ? new facturasModel({ factura: factur }) : new facturasModel({ factura: caja });

        // Guardar en la base de datos
        await data.save();

        // Responder al cliente
        res.status(200).json({ message: 'Datos enviados con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}


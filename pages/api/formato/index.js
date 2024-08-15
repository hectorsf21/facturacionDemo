import connectdb from "@/lib/db";
import formatoModel from "@/models/formato";

export default async function handler(req, res) {
    try {
        await connectdb();
        const { format } = req.body;
        const id = '66aa99426f401af401c366b2';
        const data = await formatoModel.findByIdAndUpdate(id, format, { new: true });
        
        if (data) {
            res.status(200).json({ message: 'Formato enviado con éxito' });
        } else {
            res.status(404).json({ message: 'Formato no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}


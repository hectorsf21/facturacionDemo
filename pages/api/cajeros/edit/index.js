import connectdb from "@/lib/db";
import cajerosModel from "@/models/cajeros";

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        try {
            await connectdb();
            const { id, usuario, password } = req.body;

            // Buscar y actualizar el cajero
            const updatedCajero = await cajerosModel.findByIdAndUpdate(
                id,
                { usuario, password },
                { new: true } // Retorna el documento después de la actualización
            );

            if (!updatedCajero) {
                return res.status(404).json({ message: 'Cajero no encontrado' });
            }

            res.status(200).json({ message: 'Cajero editado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error interno' });
            console.log(error);
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}

import connectdb from "@/lib/db";
import cajerosModel from "@/models/cajeros";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            await connectdb();
            const { id } = req.body;

            // Buscar y eliminar el cajero
            const deletedCajero = await cajerosModel.findByIdAndDelete(id);

            if (!deletedCajero) {
                return res.status(404).json({ message: 'Cajero no encontrado' });
            }

            res.status(200).json({ message: 'Cajero eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error interno' });
            console.log(error);
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}

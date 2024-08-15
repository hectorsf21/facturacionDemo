import connectdb from "@/lib/db";
import productoModel from "@/models/producto";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      await connectdb();
      const { id } = req.body;
      await productoModel.findByIdAndDelete(id);
      res.status(200).json({ message: "producto eliminado." });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}

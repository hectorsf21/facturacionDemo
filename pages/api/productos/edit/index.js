import connectdb from "@/lib/db";
import productoModel from "@/models/producto";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      await connectdb();
      const { id, ...data } = req.body;
      const product = await productoModel.findByIdAndUpdate(id, data, { new: true });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al editar producto." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
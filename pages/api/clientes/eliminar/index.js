import connectdb from "@/lib/db";
import Client from "@/models/clientes";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      await connectdb();
      const { id } = req.body;
      await Client.findByIdAndDelete(id);
      res.status(200).json({ message: "Cliente eliminado." });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar cliente." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}

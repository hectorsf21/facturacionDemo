import connectdb from "@/lib/db";
import Client from "@/models/clientes";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      await connectdb();
      const { id, ...data } = req.body;
      const client = await Client.findByIdAndUpdate(id, data, { new: true });
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ message: "Error al editar cliente." });
    }
  } else {
    res.status(405).json({ message: "Método no permitido." });
  }
}
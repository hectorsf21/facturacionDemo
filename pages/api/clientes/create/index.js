import connectdb from "@/lib/db";
import clientesModel from "@/models/clientes";

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        await connectdb();
        const client = new clientesModel(req.body);
        await client.save();
        res.status(201).json(client);
      } catch (error) {
        res.status(500).json({ message: "Error al crear cliente." });
      }
    } else {
      res.status(405).json({ message: "Método no permitido." });
    }
  }
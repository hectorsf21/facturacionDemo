import connectdb from "@/lib/db";
import productoModel from "@/models/producto";

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        await connectdb();
        const client = new productoModel(req.body);
        await client.save();
        res.status(201).json(client);
      } catch (error) {
        res.status(500).json({ message: "Error al crear producto." });
      }
    } else {
      res.status(405).json({ message: "Método no permitido." });
    }
  }
import connectdb from "@/lib/db";
import usuariosMaster from "@/models/usuariosMaster";
import cajerosModel from "@/models/cajeros";
import jwt from 'jsonwebtoken';

export default async function handle(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    await connectdb();

    const { usuario, password } = req.body.data;

    try {
        let user = await usuariosMaster.findOne({ usuario: usuario });

        if (!user) {
            user = await cajerosModel.findOne({ usuario: usuario });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Autenticación exitosa', token, usuario, user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

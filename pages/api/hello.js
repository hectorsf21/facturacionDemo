import connectDb from '../../lib/db';

export default async function handler(req, res) {

try {
    await connectDb();
    res.status(200).json({ message: 'Conexión a la base de datos exitosa' });

} catch (error) {
    res.status(500).json({ message: 'Error conectando a la base de datos', error: error.message });
}

}

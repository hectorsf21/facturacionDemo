import connectdb from "@/lib/db"
import facturasModel from "@/models/facturas"

export default async function handler(req, res) {
        try {
            await connectdb()
            const {_id}= req.body
            await facturasModel.findByIdAndDelete(_id)
            res.status(200).json({message:'factura eliminada con exito'})
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'error interno en el servidor'})
        }

}
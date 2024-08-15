import connectdb from "@/lib/db";
import cajerosModel from "@/models/cajeros";

export default async function handler(req, res){

    try {
        await connectdb()
        const {formData} = req.body
        const data = new cajerosModel(formData)
        await data.save()
        res.status(200).json({message:'Cajero creado correctamente'})
    } catch (error) {
        res.status(500).json({message:'error interno'})
        console.log(error)
    }

}
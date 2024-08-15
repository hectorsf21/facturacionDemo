import mongoose from "mongoose";

const productosModel = new mongoose.Schema({
    nombre:{
        type:String
    },
    gramos:{
        type:String
    },
    precio:{
        type:String
    }

})

export default mongoose.models.productos || mongoose.model('productos', productosModel)
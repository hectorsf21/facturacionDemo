import mongoose from "mongoose";

const clientesModel = new mongoose.Schema({
    nombres:{
        type:String
    },
    apellidos:{
        type:String
    },
    cedula:{
        type:String
    },
    credito:{
        type:String
    },
    abono:{
        type:String
    }

})

export default mongoose.models.clientes || mongoose.model('clientes', clientesModel)
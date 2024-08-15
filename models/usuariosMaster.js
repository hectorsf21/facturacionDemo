import mongoose from "mongoose";

const usuariosMasterSchema = new mongoose.Schema({
    usuario:{
        type:String
    },
    password:{
        type: String
    }
})

export default mongoose.models.usuariosMaster || mongoose.model('usuariosMaster', usuariosMasterSchema)
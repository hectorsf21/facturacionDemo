import mongoose from "mongoose";

const formatoModel = new mongoose.Schema({
    compania:{
        type:String
    },
    rif:{
        type:String
    },
    direccion:{
        type:String
    }

})

export default mongoose.models.formato || mongoose.model('formato', formatoModel)
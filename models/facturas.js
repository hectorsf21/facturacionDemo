import mongoose from "mongoose";

const facturasModel = new mongoose.Schema({
    factura:{
        type:Object
    }

})

export default mongoose.models.facturas || mongoose.model('facturas', facturasModel)
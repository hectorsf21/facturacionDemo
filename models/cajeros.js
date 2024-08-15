import mongoose from "mongoose";

const cajerosModel = new mongoose.Schema ({
        nombre:{
                type:String
        },
        usuario:{
            type:String
        },
        password:{
            type:String
        }
})

export default mongoose.models.cajeros || mongoose.model('cajeros', cajerosModel)
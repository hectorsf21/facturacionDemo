import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI
const connectdb = ()=>{
    try{
        mongoose.connect(MONGODB_URI,
            {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            }
        )
        console.log('base de datos conectada')
    }catch(err){

    }
   
}

export default connectdb
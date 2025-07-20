import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const db_conn = async () =>{
    try{
        const connect = await mongoose.connect(process.env.DBconn_string)
        console.log(`MongoDB connected: ${connect.connection.host} name: ${connect.connection.name}`)
    } catch(e){
        console.log(e)
        process.exit(1)
    }
}

export default db_conn;
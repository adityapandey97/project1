import dotenv from "dotenv";
import dbconect from "./db/dbconection.js";
import {app} from "./app.js";


dotenv .config({
    path:'./env'
})


//it was a function call off dbconect to connect the db and start the server only when the db is connected
dbconect()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is listening at:${process.env.PORT}`);
    })
    app.on("error",(error)=>{
        console.log("ERROR:",error)
    })
})
.catch((error)=>{
    console.log(`mongodb conection is faild!!`,error)
})



























/*
this was a method 1 to connect db and handle erro but it was bad practice so we use method 2
import mongoose from "mongoose";
import { DB_name } from "./constants.js";
import express from "express";
const app = express();
(async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_name}`);
        console.log(`\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
            app.on("error",(error) =>{
                console.log("Error:",error);
                throw error
            })
            app.listen(process.env.PORT,()=>{
                console.log('app is lisintig at port:${prosses.env.PORT}');
            })
    }

    catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
})();
*/
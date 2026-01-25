import dotenv from "dotenv";
import dbconect from "./db/dbconection.js";


dotenv .config({
    path:'./env'
})



dbconect()



























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
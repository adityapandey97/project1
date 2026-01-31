import CookieParser from "cookie-parser";

import cors from "cors"

import express from "express"
const app  = express();

//USE TO HANDLE CROSS ORGIN ERROR IN THE BROWSER TO ALLOW THE FRONTEND TO READ THE BACKENG OR LISITEN ON SERVER
app.use(cors({
    origin:process.env.CROSS_ORIGIN_URL,
    Credentials:true
}))
//USE TO TAKE JSON FILE DATA FROM SERVER
app.use(express.json({
    limit:`50kb`
}))
//USE TO READ DATA FROM URL AND DECODE THEM
app.use(express.urlencoded({
    extended:true,
    limit:`50kb`
}))
//THIS IS FOR TAKING YOUR LOCAL DATA OF SOME SPECIFIC ASSEST AS A BACKEP
app.use(express.static('public'))
//cookie-parser is an Express middleware that parses cookies from incoming HTTP requests and makes them available in req.cookies for easy access.
//it reads cookies from the browser request and converts them into a JavaScript object.
app.use(CookieParser())



// routes import
import userRouter from "./routes/user.routes.js"

// routes use


app.use("/api/v1/users",userRouter)
 
// https:localhost:8000/api/v1/users/register

export { app };
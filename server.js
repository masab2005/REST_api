import express from "express";
import dotenv from "dotenv";
import route from "./src/routes/route.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import {apiLimiter} from "./src/middlewares/rateLimits.js";
import db_conn from "./src/config/db_conn.js";
dotenv.config();
db_conn()
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(apiLimiter)
app.use("/api",route);
app.use(errorHandler)

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
});


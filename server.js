import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import route from "./src/routes/route.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import {apiLimiter} from "./src/middlewares/rateLimits.js";
import db_conn from "./src/config/db_conn.js";
import corsConfig from "./src/middlewares/corsConfig.js";
import helmet from "helmet";
dotenv.config();
db_conn()
const app = express();
// Trust the proxy (required for correct IP detection on Railway and for express-rate-limit)
app.set('trust proxy', true);

const PORT = process.env.PORT || 5000;

app.use(corsConfig);
app.use(helmet());
app.use(express.json()); //Helmet sets secure HTTP headers (CSP, X-Frame-Options, etc) to block common web attacks
app.use(cookieParser());
app.use(apiLimiter)
app.use("/api",route);
app.use(errorHandler)

// Add a root endpoint for health check
app.get('/', (req, res) => {
    res.json({ status: 'API is working' });
});

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
});


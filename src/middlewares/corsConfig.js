import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const allowed_Origins = process.env.ALLOWED_ORIGINS? process.env.ALLOWED_ORIGINS.split(',') : [];
const allowed_Headers = process.env.ALLOWED_HEADERS? process.env.ALLOWED_HEADERS.split(',') : [];
const allowed_Methods = process.env.ALLOWED_METHODS? process.env.ALLOWED_METHODS.split(',') : [];  
const CREDENTIALS = process.env.CREDENTIALS === 'true';

export default cors({
  origin: function (origin, callback) {
    if (!origin || allowed_Origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: allowed_Methods,
  allowedHeaders: allowed_Headers,
  credentials: CREDENTIALS,
  optionsSuccessStatus: 200,
});
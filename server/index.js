import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';

const app= express();
app.use(cookieParser());

import "./db.js";

import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js"
import billRoutes from "./routes/billRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js"
app.use(bodyParser.json());
import cors  from "cors";

// import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));


// Get the current directory (__dirname equivalent in ES Modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/server/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(cors());
app.use('/api/user',userRoutes );
app.use('/api/bill',billRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/feedback' ,feedbackRoutes);

app.get('/', (req, res)=>{
    res.json({
        success:true,
        message:"GET METHODDDDD"
    })
})
const PORT=process.env.PORT || 8000
app.listen(PORT,()=>{
    
    console.log("Server is up at post "+PORT);
    
})



app.use((err, req, res, next)=>{
 const statusCode = err.statusCode || 500;
 const message =err.message || 'Internal server Error';

 return res.status(statusCode).json({
    success:false,
    message,
    statusCode
 })
})
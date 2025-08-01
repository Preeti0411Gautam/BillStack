import express from 'express';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors  from "cors";
import basicAuth from 'express-basic-auth';

const app= express();
app.use(cookieParser());


//Setup Prometheus & logging 
import { metricsLogger, logger } from './middlewares/metricsLogger.js';
import promClient from './utils/metrics.js';

// Use metrics logger for all routes
app.use(metricsLogger);

import "./db.js";
import { dueDateNotifier, uploadBillNotifer } from './jobs/dailyNotifier.js';
dueDateNotifier();
uploadBillNotifer();


//testing 
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});


//Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js"
import billRoutes from "./routes/billRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import contactUsRoutes from "./routes/contactUsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


app.use(bodyParser.json());

const corsOptions = {
  origin: "https://bill-stack.vercel.app/",
  credentials: true, 
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));



// Get the current directory (__dirname equivalent in ES Modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/server/uploads', express.static(path.join(__dirname, 'uploads')));

//API Routes
app.use('/api/user',userRoutes );
app.use('/api/bill',billRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/feedback' ,feedbackRoutes);
app.use('/api/contact-us', contactUsRoutes);
app.use("/api/notifications", notificationRoutes);



// Metrics route
app.get(
  '/metrics',
  basicAuth({
    users: { [process.env.METRICS_USER]: process.env.METRICS_PASS },
    challenge: true,
  }),
  async (req, res) => {
    res.setHeader("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  }
);

// Root test
app.get('/', (req, res) => {
  logger.info('Req came on / route');
  res.json({ success: true, message: "Hello There!!" });
});



// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  logger.error(message);
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});


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
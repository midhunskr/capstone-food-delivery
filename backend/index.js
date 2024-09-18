//Import packages
import cors from 'cors'
import express from 'express'
import apiRouter from './routes/index.js'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'

//Assign express to 'app' variable
const app = express()

//CORS for Authentication
app.use(cors({
  origin: 'https://chewse-food-delivery.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));


//Unsafe-inline
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy', 
    "style-src 'self' 'unsafe-inline';" // Add 'unsafe-inline'
  );
  next();
});

//Parsing incoming JSON requests and puts the parsed data in req.body 
app.use(express.json())
//Parsing incoming cookie
app.use(cookieParser())

//Import PORT from 'env'
const port = process.env.PORT

//Connect Databse from 'config/db'
connectDB()

//Import 'apiRouter' from 'routes/index.js'
app.use('/api', apiRouter)

//Setup port
app.listen(port, () => {
  console.log(`Server started running on port ${port}`)
})
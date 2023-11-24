import express from "express";
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import musicRoutes from './routes/musicRoutes.js'
import roomRoutes from './routes/roomRoutes.js  '
import cookieParser from "cookie-parser";
import cors from 'cors';


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); 
app.use(cors());
app.use(cookieParser());


app.use('/api/users',userRoutes);
app.use('/api/music',musicRoutes);
app.use('/api/room',roomRoutes);

app.get('/',(req, res)=>{
    res.send('Server is ready');
})

app.listen(PORT,()=>{
    console.log("Server started")
})
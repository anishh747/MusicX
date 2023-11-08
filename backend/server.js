import express from "express";
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import musicRoutes from './routes/musicRoutes.js'
import cookieParser from "cookie-parser";


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); 
app.use(cookieParser());


app.use('/api/users',userRoutes);
app.use('/api/music',musicRoutes);

app.get('/',(req, res)=>{
    res.send('Server is ready');
})

app.listen(PORT,()=>{
    console.log("Server started")
})
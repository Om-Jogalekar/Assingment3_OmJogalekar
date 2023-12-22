require('dotenv').config();
const express = require('express');
const connectDB = require('./connectDb');
const userRouter = require("./router/user");
const productRouter = require('./router/product'); 
const port = process.env.PORT ;
const app = express();
const URI = process.env.MONGODB_URI;


connectDB(URI);
app.use(express.json());
app.use("/api/", userRouter);
app.use("/api/", productRouter);

app.listen(port,()=>{
    console.log(`server is connected to ${port}`);
})
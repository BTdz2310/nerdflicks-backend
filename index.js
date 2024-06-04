const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();


const app = express();

const http = require('http');
const index = http.createServer(app);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const port = process.env.PORT || 5001;

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connect DB Successful')
    }catch(error){
        console.log('Error Connect DB',error)
    }
}

connectDB();

app.use('/api', require('./routers/userRouter'))
app.use('/api', require('./routers/postRouter'))
app.use('/api', require('./routers/commentRouter'))
app.use('/api', require('./routers/notificationRouter'))

index.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})


const express=require('express');
const errorMiddleware=require('./middleware/error')
const cookieParser=require('cookie-parser')
const app = express();

app.use(express.json())
app.use(cookieParser())

//Routes import
const profile = require("./routes/profileRoute");
const user = require('./routes/userRoute');


app.use('/api/v1',profile);
app.use('/api/v1',user)

// errorhandler
app.use(errorMiddleware)

module.exports=app;
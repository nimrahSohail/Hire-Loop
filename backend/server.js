const app = require('./app');

const dotenv=require('dotenv');

const connectDatabase=require('./config/database');
// handling uncaught exception
process.on('uncaughtException',err=>{
    console.log(`Error:${err}`);
    console.log('shutting down the server due to uncaughtException');
    
        process.exit(1)
})



// config
dotenv.config({path:'./backend/config/config.env'});
console.log(process.env.PORT);

// connecting to database
connectDatabase()

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is listening at http://localhost:${process.env.PORT}`)
});

// Unhandled Promise Rejection
process.on('unhandledRejection',err=>{
    console.log(`Error:${err}`);
    console.log('shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1)
    })
})
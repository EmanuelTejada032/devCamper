const express = require('express');
const  dotenv = require('dotenv');
// const logger = require('./middleware/logger');
const morgan = require('morgan')
const connectDB = require('./config/db');


//load env vars
dotenv.config({ path: './config/config.env' });
const app = express();


//connect to db
connectDB();


//Routes files
 const bootcamps = require('./routes/campgrounds');
 

 
 // app.use(logger);
 if(process.env.NODE_ENV === 'development'){
     app.use(morgan('dev'));
 }
 
app.use('/api/v1/bootcamps', bootcamps);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`)
});

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)

    //close the server
    server.close(() => process.exit(1))
})
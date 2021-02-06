const express = require('express');
const  dotenv = require('dotenv');
const path = require('path')
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');




//load env vars
dotenv.config({ path: './config/config.env' });



//Routes files
 const bootcamps = require('./routes/bootcamps');
 const courses = require('./routes/courses')
 const auth = require('./routes/auth');



const app = express();

//using express-fileupload
app.use(fileUpload())

//Serving static folder public
app.use(express.static(path.join(__dirname, 'public')))


//Body parser
app.use(express.json());


//connect to db
connectDB();


 


 
 // app.use(logger);
 if(process.env.NODE_ENV === 'development'){
     app.use(morgan('dev'));
 }
 
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler)


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
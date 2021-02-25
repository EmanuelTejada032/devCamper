const express = require('express');
const  dotenv = require('dotenv');
const path = require('path')
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');




const app = express();




//load env vars
dotenv.config({ path: './config/config.env' });



//Routes files
 const bootcamps = require('./routes/bootcamps');
 const courses = require('./routes/courses')
 const auth = require('./routes/auth');
 const users = require('./routes/users');
 const reviews = require('./routes/reviews');





//using express-fileupload
app.use(fileUpload());



// Set cookie parser ready to use
app.use(cookieParser());

//Bring express mongo sanitize to sanitize our app
app.use(mongoSanitize());

//Bringing helmet to set some security headers
app.use(helmet({contentSecurityPolicy: false }));


//Bringing xss to avoid script tag from the body input
app.use(xss());

//Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // time limit 10 mins
    max: 50 //50 request max
});

app.use(limiter);

//prevent http params pollution
app.use(hpp());

//Bring cors to make API public and share with all domains coming from outside of ours
app.use(cors());

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
app.use('/api/v1/auth/users', users)
app.use('/api/v1/reviews', reviews)
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
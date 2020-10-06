const express = require('express');
const  dotenv = require('dotenv');
// const logger = require('./middleware/logger');
const morgan = require('morgan')


//Routes files
 const bootcamps = require('./routes/campgrounds');

//load env vars

dotenv.config({ path: './config/config.env' });
const app = express();

// app.use(logger);
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps', bootcamps);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`)
});
const express = require('express');
const  dotenv = require('dotenv');

//Routes files
 const bootcamps = require('./routes/campgrounds');

//load env vars
dotenv.config({ path: './config/config.env' });

const app = express();


app.use('/api/v1/bootcamps', bootcamps)

const logger = (req, res, next) => {
    console.log("some");
    next();
}

app.use(logger);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`)
});
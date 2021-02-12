const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


//Load env varuable
dotenv.config({path: './config/config.env'});

//load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

//connect to DB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})


//Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));

//Import data to DB
const importData = async() => {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log("Data imported with seeder !")
        process.exit();
    }catch(err){
        console.error(err)
    }
}


//Delete data 
const deleteData = async() => {
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log("Data Destroyed ... ")
        process.exit();
    }catch(err){
        console.error(err)
    }
}



if(process.argv[2] === '-i'){
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}
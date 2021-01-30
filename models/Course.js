const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const CourseSchema = new Schema({
    title:{
        type: String,
        trim: true,
        required:[true, 'Please add a title']
    },
    description:{
        type: String,
        required: [true, 'Please add a description']
    },
    weeks:{
        type: Number,
        required: [true, 'Please add a number of weeks']
    },
    tuition:{
        type: String,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill:{
        type: String,
        required: [true, 'Please add minimun skill required'],
        enum:['beginner','intermediate', 'advance']
    },
    scholarshipsAvailable:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    bootcamp:{
        type: Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }

})



module.exports = new mongoose.model('Course', CourseSchema)
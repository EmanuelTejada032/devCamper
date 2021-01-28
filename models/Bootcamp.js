const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify')



const BootcampSchema = new Schema({
    name: {
        type: String,
        required: [true, 'please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 chars']
    },
    slug: String,
    description:{
        type: String,
        required: [true, 'please add a description'],
        maxlength: [500, 'Name cannot be more than 500 chars']
    },
    website:{
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with http or https protocol'
        ]
    },
    phone: {
        type:String,
        maxlength: [20, 'Phone number cannot be longer than 20 chars']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    address:{
        type:String,
        required: [true, 'Please add an address']
    },
    location: {
        //geoJSON point
        type:{
            type: String,
            enum: ['point'],     
        },
        coordinates: {
            type: Number,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String, 
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number, 
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10']
    },
    averageCost: Number,
    photo:{
        type:String,
        default: 'no-photo.jpg'
    },
    housing:{
        type: Boolean,
        default: false
    },
    jobAssistance:{
        type: Boolean,
        default: false
    },
    jobGuarantee:{
        type: Boolean,
        default: false
    },
    acceptGi:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

});


BootcampSchema.pre('save', function(){
    this.slug = slugify(this.name, {lower: true})
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)
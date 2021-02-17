const mongoose = require('mongoose');
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ],
        unique: true,
        required: [true, 'You need to add an email']  
    },
    role:{
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password:{
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date,
    createdAt:{
        type: Date,
        default: Date.now
    }
});

//Encrypting password
UserSchema.pre('save', async function(next) {

    if(!this.isModified('password')){
        return next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre("findOneAndUpdate", async function() {
    const docToUpdate = await this.model
      .findOne(this.getQuery())
      .select("+password");
    const salt = await bcrypt.genSalt(10);
    docToUpdate.password = await bcrypt.hash(docToUpdate.password, salt);
    docToUpdate.save();
  });

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

//compare encrypted password with entered password using bcrypt
UserSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Generate and create password Token
UserSchema.methods.getResetPasswordToken = function(){
   //generate token
   const resetToken = crypto.randomBytes(20).toString('hex');

   //Hash token and set it to resetpasswordtoken field
   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');


   //Set expire
   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


module.exports = new mongoose.model('User', UserSchema)
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const saltRound = 10;

let userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    isactive: Boolean,
    createddate: Date,
    updateddate: Date
});

userSchema.pre('save', function (next) {
    console.log('UserSchema pre calling');
    var currentDate = new Date();
    this.updateddate = currentDate;
    if (this.createddate == undefined) {
        this.createddate = currentDate;
    }
    this.password = bcrypt.hashSync(this.password, saltRound);
    next();
});

module.exports = mongoose.model('user', userSchema);
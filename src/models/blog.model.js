import mongoose from 'mongoose';

let blogSchema = new mongoose.Schema({
    blogtext: {
        type: String,
        required: true
    },
    userid:{
        type:String,
        required:true
    },
    isactive: Boolean,
    createddate: Date,
    updateddate: Date
});

blogSchema.pre('save', function (next) {
    console.log('blogSchema pre calling');
    var currentDate = new Date();
    this.updateddate = currentDate;
    if (this.createddate == undefined) {
        this.createddate = currentDate;
    }
    next();
});

module.exports = mongoose.model('blog', blogSchema);
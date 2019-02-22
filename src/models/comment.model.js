import mongoose from 'mongoose';

let commentSchema = new mongoose.Schema({
    commenttext: {
        type: String,
        required: true
    },
    blogid:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    likes: {
        type: Array,
        default: []
    },
    isactive: Boolean,
    createddate: Date,
    updateddate: Date
});

commentSchema.pre('save', function (next) {
    console.log('commentSchema pre calling');
    var currentDate = new Date();
    this.updateddate = currentDate;
    if (this.createddate == undefined) {
        this.createddate = currentDate;
    }
    next();
});

module.exports = mongoose.model('comment', commentSchema);
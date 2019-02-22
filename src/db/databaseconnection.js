import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-training-accessment", { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to the database !!');
    })
    .catch((err) => {
        console.log('Connection failed', err);
        process.exit();
    });
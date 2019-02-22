import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import config from '../config.json'
import dbConnection from './db/databaseconnection';

const tokenList = {};

let app = express();
app.use(bodyParser.json());

let userRoute = require('./routes/user');
app.use('/api/user', userRoute);

let blogRoute = require('./routes/blog');
app.use('/api/blog', blogRoute);

let commentRoute = require('./routes/comment');
app.use('/api/comment', commentRoute);

let likeRoute = require('./routes/like');
app.use('/api/like', likeRoute);

app.use(express.static('public'));

// Normal request
app.use((req, res, next) => {
    console.log(`${new Date().toString()} => ${req.originalUrl} ${req.body}`);
    next();
});

//Error handling

//400 - Not found error
app.use((req, res, next) => {
    res.status(404).send('Error - we think you are lost.');
    next();
});

//500 - Internal server error
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.sendFile(path.join(__dirname, '../public/500.html'));
    next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
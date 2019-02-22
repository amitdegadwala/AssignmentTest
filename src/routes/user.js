import express from 'express';
import userModel from '../models/user.model';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import config from '../../config.json';

const router = express.Router();

// Login with user
router.post('/login', function (req, res, next) {
    console.log('post to login user');
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Request body is missing!"
        });
    }

    userModel.findOne({
        username: req.body.username
    }, function (err, userDetails) {
        if (err) {
            next(err);
        } else {
            if (userDetails == null) {
                res.status(500).json({
                    status: "error",
                    message: "User not found",
                    data: null
                });
            } else {
                if (bcrypt.compareSync(req.body.password, userDetails.password)) {

                    // generate JWT token
                    const user = {
                        "username": req.body.username,
                        "password": req.body.password
                    };
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: config.tokenLife
                    });
                    const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
                        expiresIn: config.refreshTokenLife
                    });
                    //tokenList[refreshToken] = response
                    const tokenDetails = {
                        "status": "User login",
                        "token": token,
                        "refreshToken": refreshToken
                    };
                    // return success
                    res.status(200).json({
                        status: "success",
                        message: "Login successfully",
                        data: {
                            user: userDetails,
                            token: tokenDetails
                        }
                    });
                } else {
                    // login fail
                    res.status(500).json({
                        status: "error",
                        message: "Invalid credentials",
                        data: null
                    });
                }
            }
        }
    });
});

// Create new user
router.post('', function (req, res, next) {
    console.log('post to create user');
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing');
    }

    let model = new userModel({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        isactive: req.body.isactive
    });
    model.save()
        .then((doc) => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc);
            }
            res.status(201).send(doc);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

// JWT secure validation
router.use(require('../../tokenChecker'))

// Get all user
router.get('', function (req, res, next) {
    console.log('call get all user');
    userModel.find()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Get user details
router.get('/getuser', function (req, res, next) {
    userModel.findOne({
            username: req.query.username
        })
        .then(doc => {
            if (doc == null) {
                res.status(500).json({
                    status: "error",
                    message: "User not found.",
                    data: null
                })
            } else {
                res.status(200).send(doc);
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Update existing user
router.put('', function (req, res, next) {
    console.log('put to update existing user');
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing');
    }

    userModel.findOneAndUpdate({
            username: req.query.username
        }, req.body, {
            new: true
        })
        .then(result => {
            if (result == null) {
                res.status(500).json({
                    status: "error",
                    message: "User not found.",
                    data: null
                })
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Record updated successfully.",
                    data: result
                })
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// Delete a user - delete api
router.delete('', (req, res) => {
    userModel.findOneAndRemove({
            username: req.query.username
        })
        .then(doc => {
            if (doc == null) {
                res.status(500).json({
                    status: "error",
                    message: "User not found.",
                    data: null
                })
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Record deleted successfully.",
                    data: doc
                })
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;
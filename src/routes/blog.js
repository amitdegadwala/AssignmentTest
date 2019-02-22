import express from 'express';
import blogModel from '../models/blog.model';
import userModel from '../models/user.model';

const router = express.Router();

// // JWT secure validation
// router.use(require('../../tokenChecker'))

// Create new blog
router.post('', function (req, res, next) {
    console.log('post to create blog');
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing');
    }

    userModel.findOne({
        _id: req.body.userid
    }, function (err, userDetail) {
        if (err) {
            next(err);
        } else {
            if (userDetail == null) {
                res.status(500).json({
                    status: "error",
                    message: "User not found.",
                    data: null
                })
            } else {
                let model = new blogModel({
                    blogtext: req.body.blogtext,
                    userid: req.body.userid,
                    isactive: req.body.isactive
                });
                model.save()
                    .then((doc) => {
                        if (!doc || doc.length === 0) {
                            res.status(500).json({
                                status: "error",
                                message: err,
                                data: null
                            });
                        }
                        res.status(200).json({
                            status: "success",
                            message: "Post added successfully.",
                            data: doc
                        });
                    }).catch((err) => {
                        res.status(500).json({
                            status: "error",
                            message: err,
                            data: null
                        });
                    });
            }
        }
    });
});

// Get all blog
router.get('', function (req, res, next) {
    console.log('call get all blog');
    blogModel.find()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Get blog details
router.get('/getblog', function (req, res, next) {
    console.log('get existing blog by id');
    blogModel.findOne({
            _id: req.query.blogid
        })
        .then(doc => {
            if (doc == null) {
                res.status(500).json({
                    status: "error",
                    message: "blog not found.",
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

// Update existing blog
router.put('', function (req, res, next) {
    console.log('put to update existing blog');
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing');
    }

    blogModel.findOneAndUpdate({
            _id: req.query.blogid
        }, req.body, {
            new: true
        })
        .then(result => {
            console.log(result);
            if (result == null) {
                res.status(500).json({
                    status: "error",
                    message: "blog not found.",
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

// Delete a blog
router.delete('', (req, res) => {
    blogModel.findOneAndRemove({
            _id: req.query.blogid
        })
        .then(doc => {
            if (doc == null) {
                res.status(500).json({
                    status: "error",
                    message: "blog not found.",
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
import express from 'express';
import blogModel from '../models/blog.model';
import userModel from '../models/user.model';
import commentModel from '../models/comment.model';

const router = express.Router();

// // JWT secure validation
// router.use(require('../../tokenChecker'))

// Create new comment
router.post('', function (req, res, next) {
    console.log('Post to create comment');
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

                blogModel.findOne({
                    _id: req.body.blogid
                }, function (err, blogDetails) {
                    if (blogDetails == null) {
                        res.status(500).json({
                            status: "error",
                            message: "Blog not found.",
                            data: null
                        })
                    } else {
                        let model = new commentModel({
                            commenttext: req.body.commenttext,
                            blogid: req.body.blogid,
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
                                    message: "Comment added successfully.",
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
                });
            }
        }
    });
});

// Get all comment
router.get('', function (req, res, next) {
    console.log('Call get all comment');
    commentModel.find()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Get comment details
router.get('/getcomment', function (req, res, next) {
    console.log('Get existing blog by id');
    commentModel.findOne({
            _id: req.query.commentid
        })
        .then(doc => {
            if (doc == null) {
                res.status(500).json({
                    status: "error",
                    message: "Comment not found.",
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

// Update existing comment
router.put('', function (req, res, next) {
    console.log('Put to update existing comment');
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Request body is missing');
    }

    commentModel.findOneAndUpdate({
            _id: req.query.commentid
        }, req.body, {
            new: true
        })
        .then(result => {
            console.log(result);
            if (result == null) {
                res.status(500).json({
                    status: "error",
                    message: "Comment not found.",
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
    commentModel.findOneAndRemove({
            _id: req.query.commentid
        })
        .then(doc => {
            if (doc == null) {
                res.status(500).json({
                    status: "error",
                    message: "Commnet not found.",
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
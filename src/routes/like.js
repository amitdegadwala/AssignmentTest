import express from 'express';
import blogModel from '../models/blog.model';
import userModel from '../models/user.model';
import commentModel from '../models/comment.model';

const router = express.Router();

// // JWT secure validation
// router.use(require('../../tokenChecker'))

//put user comment LIKE/DISLIKE
router.put('', function (req, res, next) {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Request body is missing!"
        });
    }

    if (Object.keys(req.body).length != 0) {
        userModel.findOne({
                _id: req.body.userid
            }).then(results => {
                if (results == null) {
                    res.status(500).json({
                        status: "error",
                        message: "User not found.",
                        data: null
                    });
                } else {
                    blogModel.findOne({
                        _id: req.body.blogid
                    }).then(results => {
                        if (results == null) {
                            res.status(500).json({
                                status: "error",
                                message: "Blog not found.",
                                data: null
                            });
                        } else {
                            commentModel.findOne({
                                _id: req.body.commentid
                            }).then(results => {
                                if (results == null) {
                                    res.status(500).json({
                                        status: "error",
                                        message: "Comment not found.",
                                        data: null
                                    });
                                } else {
                                    let updateData = {
                                        likes: {
                                            userid: req.body.userid,
                                            like: req.body.like
                                        }
                                    };
                                    commentModel.findOneAndUpdate({
                                            _id: req.body.commentid
                                        }, updateData, {
                                            new: true
                                        })
                                        .then(doc => {
                                            res.status(200).json({
                                                status: "success",
                                                message: "Comment likes successfully.",
                                                data: doc
                                            });
                                        })
                                        .catch(err => {
                                            res.status(500).json(err);
                                        });
                                }
                            });
                        }

                    });
                }
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }
});

module.exports = router;
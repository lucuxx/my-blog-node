// 文章接口
const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require('../util');
const _ = require('lodash');
const moment = require('moment');

function getComment() {
    return db.leavingAMessage.find();
}


// 留言新增
router.post('/api/comment/addComment', (req, res) => {
    const {comment, email, getBrowse, getOS, name, url, userId} = req.body;
    const newComment = new db.leavingAMessage({
        id: util.setRandomId(),
        time: new Date().getTime(),
        comment,
        email,
        getBrowse,
        getOS,
        name,
        reply: [],
        url,
        userId,
        fabulousNum: 0
    });
    newComment.save().then(async (req) => {
        const data = await db.leavingAMessage.find();
        if (!_.isEmpty(req)) {
            res.send({
                code: 0,
                data
            })
        }
    })
});

// 更新留言（回复留言）
router.post('/api/comment/updateComment', async (req, res) => {
    const {id, reply, fabulousNum } = req.body;
    let result = {};
    if (reply && Object.keys(reply).length !== 0) {
        result = {$push: {'reply': reply}};
    }
    if (fabulousNum) {
        const currentMessage = await db.leavingAMessage.find({id});
        const num = _.get(currentMessage, '0.fabulousNum');
        result = {$set: { fabulousNum: num + 1 }}
    }
    await db.leavingAMessage.update({id}, result).then(async req => {
        if (req.ok === 1) {
            const data = await db.leavingAMessage.find();
            res.send({
                code: 0,
                data,
            })
        } else {
            res.send({
                code: 404,
                data: '编辑失败',
            })
        }
    });
});

// 获取留言
router.get('/api/comment/getComment', async (req, res) => {
    const comment = await getComment();
    if (_.isEmpty(comment)) {
        res.send({
            code: 1,
            data: [],
        })
    } else {
        res.send({
            code: 0,
            data: comment
        })
    }
});


module.exports = router;

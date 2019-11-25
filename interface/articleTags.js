// 文章分类接口
const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require('../util');
const _ = require('lodash');


// 新增文章标签
router.post('/api/tags/addArticleTags', async (req, res) => {
    const newArticleTags = new db.articleTags({
        id: util.setRandomId(),
        name: req.body.name,
        type: req.body.type
    });
    newArticleTags.save().then(async (req) => {
        const data = await db.articleTags.find();
        if (!_.isEmpty(req)) {
            res.send({
                code: 0,
                data: _.reverse(_.cloneDeep(data))
            })
        }
    })
});

// 获取所有标签
router.get('/api/tags/getArticleTags', async (req, res) => {
    const articleTags = await db.articleTags.find();
    if (_.isEmpty(articleTags)) {
        res.send({
            code: 1,
            data: [],
        })
    } else {
        res.send({
            code: 0,
            data: _.reverse(_.cloneDeep(articleTags))
        })
    }
});

// 删除文章标签
router.post('/api/tags/deleteArticleTags', async (req, res) => {
    const data = await db.articleTags.deleteOne({id: req.body.id});
    if (data.ok === 1) {
        const data = await db.articleTags.find();
        res.send({
            code: 0,
            data: _.reverse(_.cloneDeep(data))
        })
    } else {
        res.send({
            code: 404,
            data: '删除失败!'
        })
    }
});

module.exports = router;

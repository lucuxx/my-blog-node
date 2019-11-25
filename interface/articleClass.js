// 文章分类接口
const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require('../util');
const _ = require('lodash');


// 新增文章分类
router.post('/api/class/addArticleClass', async (req, res) => {
    const newArticleClass = new db.articleClassInfo({
        id: util.setRandomId(),
        name: req.body.name,
        desc: req.body.desc
    });
    newArticleClass.save().then(async (req) => {
        const data = await db.articleClassInfo.find();
        if (!_.isEmpty(req)) {
            res.send({
                code: 0,
                data
            })
        }
    })
});

// 获取所有文章分类
router.get('/api/class/getArticleClass', async (req, res) => {
    const articleClassArr = await util.getArticleClass();
    if (_.isEmpty(articleClassArr)) {
        res.send({
            code: 1,
            data: [],
        })
    } else {
        res.send({
            code: 0,
            data: articleClassArr
        })
    }
});

// 删除文章分类
router.post('/api/class/deleteArticleClass', async (req, res) => {
    const data = await db.articleClassInfo.deleteOne({id: req.body.id});
    if (data.ok === 1) {
        const data = await db.articleClassInfo.find();
        res.send({
            code: 0,
            data
        })
    } else {
        res.send({
            code: 404,
            data: '删除失败!'
        })
    }
});

const updateArticleClass = async (req) => {
    const {id,name,desc} = req.body;
    return await db.articleClassInfo.update({id}, {$set: {name,desc}})
};

// 更新文章分类（更新内容包含文章标题/更新时间/更新内容/文章图片/文章摘要）
router.post('/api/class/updateArticleClass', async (req, res) => {
    await updateArticleClass(req).then(async req => {
        if (req.ok === 1) {
            const data = await db.articleClassInfo.find();
            res.send({
                code: 0,
                data,
            })
        } else {
            res.send({
                code: 404,
                data: '编辑文章分类失败!',
            })
        }
    })
});


module.exports = router;

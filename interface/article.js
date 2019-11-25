// 文章接口
const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require('../util');
const _ = require('lodash');


// 文章新增
router.post('/api/article/addArticle', (req, res) => {
    const newArticle = new db.articleInfo({
        id: util.setRandomId(),         // 文章id
        title: req.body.title,          // 文章标题
        abstract: req.body.abstract,    // 文章摘要
        createdTime: new Date().getTime(),     // 创建时间
        updateTime: new Date().getTime(),
        content: req.body.content,      // 文章内容
        img: req.body.img,              // 文章封面图片
        contentMD: req.body.contentMD,  // 文章内容
        author: req.body.author,        // 作者
        categoryName: req.body.categoryName,           // 分类name
        categoryId: req.body.categoryId, // 分类id
        tagName: req.body.tagName,    // 标签name
        tagId: req.body.tagId,      // 标签id
        commentNum: 0,   // 访问量
        fabulousNum: 0,    // 点赞数
    });
    newArticle.save().then(async (req) => {
        const data = await db.articleInfo.find();
        if (!_.isEmpty(req)) {
            res.send({
                code: 0,
                data
            })
        }
    })
});

// 获取分类文章
router.get('/api/article/getArticle', async (req, res) => {
    const articleArr = await util.getArticle(req.query.id);
    if (_.isEmpty(articleArr)) {
        res.send({
            code: 1,
            data: [],
        })
    } else {
        res.send({
            code: 0,
            data: articleArr
        })
    }
});

// 获取指定文章详情
router.get('/api/article/details', async (req, res) => {
    const articleDetails = await db.articleInfo.findOne({id:req.query.id});
    if (_.isEmpty(articleDetails)) {
        res.send({
            code: 1,
            data: [],
        })
    } else {
        res.send({
            code: 0,
            data: articleDetails
        })
    }

});

// 文章删除
router.post('/api/article/deleteArticle', async (req, res) => {
    const data = await db.articleInfo.deleteOne({id: req.body.articleId});
    if (data.ok === 1) {
        const data = await util.getArticle(req.body.classId);
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

// 编辑文章
async function updateArticle(req) {
    const { id, isUpdate } = req.body;
    const {fabulousNum, commentData} = await db.articleInfo.findOne({id});
    if(req.body.fabulousNum) {
        req.body.fabulousNum = fabulousNum + 1;
    }
    // 如果有评论数据
    if (req.body.comment) {
        // 如果评论数据中含有id则更新
        if(_.get(req.body.comment, 'commentId')) {
            const currentCommentIndex = _.findIndex(commentData, item => item.id === _.get(req.body.comment, 'commentId'));
            commentData[currentCommentIndex]['reply'].push(Object.assign({id: util.setRandomId()},req.body.comment))
        } else {
            commentData.push(Object.assign({id: util.setRandomId()},req.body.comment));
        }
        req.body.commentData = commentData
    }
    const result = isUpdate ? Object.assign(req.body, {updateTime: new Date().getTime() }) : req.body;
    return await db.articleInfo.update({id}, { $set: result });
}

// 更新文章（更新内容包含文章标题/更新时间/更新内容/文章图片/文章摘要）
router.post('/api/article/updateArticle', async (req, res) => {
    await updateArticle(req).then(async req => {
        if (req.ok === 1) {
            const data = await db.articleInfo.find();
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
    })
});

// 获取所有文章
router.get('/api/article/getAllArticle', async (req, res) => {
    const articleArr = await util.getAllArticle();
    if (_.isEmpty(articleArr)) {
        res.send({
            code: 1,
            data: [],
        })
    } else {
        res.send({
            code: 0,
            data: articleArr
        })
    }
});

// 获取包含指定标签的文章
router.get('/api/article/getTagArticle', async (req, res) => {
    const articleArr = await db.articleInfo.find({tagId: req.query.id});
    if (_.isEmpty(articleArr)) {
        res.send({
            code: 1,
            data: [],
        })
    } else {
        res.send({
            code: 0,
            data: articleArr
        })
    }
});


module.exports = router;

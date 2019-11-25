const db = require("../db");
const moment = require('moment');


// 自定义函数方法:
// cookie编码程序
function CodeCookie(str) {
    let strRtn = "";
    for (let i = str.length - 1; i >= 0; i--) {
        strRtn += str.charCodeAt(i);
        if (i) strRtn += "a" //用a作分隔符
    }
    return strRtn
}

// 随机id
function setRandomId() {
    return Date.now() + "" + Math.floor(Math.random() * 10000);
}

// 获取指定分类的文章
function getArticle(params) {
    return db.articleInfo.find({categoryId:params})
}

// 获取所有文章分类
function getArticleClass() {
    return db.articleClassInfo.find()
}

// 获取所有文章
function getAllArticle() {
    return db.articleInfo.find()
}

module.exports = {
    CodeCookie,
    setRandomId,
    getArticle,
    getArticleClass,
    getAllArticle,
};

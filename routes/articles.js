const express = require('express');
const articlesRouter = express.Router();
const { postArticle, getAllArticles, deleteArticleByID } = require('../controllers/articles');
const { celebrate, Joi } = require('celebrate');

articlesRouter.post('/', celebrate({
    body: Joi.object().keys({
        keyword: Joi.string().required(),
        title: Joi.string().required(),
        text: Joi.string().required(),
        date: Joi.string().required(),
        source: Joi.string().required(),
        link: Joi.string().required().uri(),
        image: Joi.string().required().uri()
    }),
}), postArticle); 
articlesRouter.get('/', getAllArticles);
articlesRouter.delete('/:id', celebrate({
    params: Joi.object().keys({
        id: Joi.string().hex().length(24),
    })
}), deleteArticleByID);


module.exports = articlesRouter;
const express = require('express');
const Article = require('../models/article');
const {NoRightsError} = require('../errors/errors');
const {NotFoundError} = require('../errors/errors');
const {InvalidData} = require('../errors/errors');

module.exports.postArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;

  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      if (!article) {
        throw new InvalidData('No article was created');
      }
      res.send(article)
    })
    .catch(next);
};

module.exports.getAllArticles = (req, res, next) => {
  Article.find({})
    .then((article) => {
      if (!article) {
        throw new NotFoundError('No articles found');
      }
      res.send(article)
    })
    .catch(next);
};

module.exports.deleteArticleByID = (req, res, next) => {
  Article.findById(req.params.id)
    .then(article => {
      if (!article) {
        throw new NotFoundError('No article found');
      }
      if (article.owner == req.user._id) {
        Article.findByIdAndRemove(req.params.id)
          .then(res.send({ message: 'The articles was removed' }))
      } else {
        throw new NoRightsError('You can only delete yours articles');
      }
    })
    .catch(next);
};

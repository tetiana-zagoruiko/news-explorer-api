const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {NoRightsError} = require('../errors/errors');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.send(user)
    })
    .catch(next);
};


module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      if (!user) {
        throw new NoRightsError('Please enter valid email and password');
      };
      if (NODE_ENV === 'production') {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.send(token);
      } else {
        const token = jwt.sign({ _id: user._id }, "secret-key", { expiresIn: '7d' });
        res.send(token);
      }
    })
    .catch(next);
};


module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => res.send({ data: user }))
    .catch(next);
};

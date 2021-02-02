const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {NoRightsError} = require('../errors/errors');
require('mongoose-type-email');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});


userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoRightsError('There is no such email in the database');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoRightsError('Email and passwords don\'t match');
          }
          return user;
        })
        .catch(next);
    })
    .catch(next);
};

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

module.exports = mongoose.model('user', userSchema);
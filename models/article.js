const mongoose = require('mongoose');
require('mongoose-type-url');
const validate = require('mongoose-validator')

const UrlValidator = [
  validate({
    validator: 'isURL'
  })
]

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: mongoose.SchemaTypes.Url,
    required: true,
    validate: UrlValidator
  },
  image: {
    type: mongoose.SchemaTypes.Url,
    required: true,
    validate: UrlValidator
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  versionKey: false
});


module.exports = mongoose.model('article', articleSchema);

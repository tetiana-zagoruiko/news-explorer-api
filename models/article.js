const mongoose = require('mongoose');
require('mongoose-type-url');

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
  },
  image: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  versionKey: false
});

articleSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.owner;
  return obj;
}

module.exports = mongoose.model('article', articleSchema);

var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var bcrypt = require('bcryptjs');

var EventSchema = new Schema({
  creator : [{ type: SchemaTypes.ObjectId, ref: 'User' }],
  name    : String,
  languages : Array,
  category : Number,
  subCategory : Number,
  priceNumber : Number,
  priceCurrency : String,
  date : Date,
  city : String,
  address : String,
  lat : SchemaTypes.Double,
  lng : SchemaTypes.Double,
  spotsMax : Number,
  spotsLeft: Number,
  users : [{ type: SchemaTypes.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', EventSchema);
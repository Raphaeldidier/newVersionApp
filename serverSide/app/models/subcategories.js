var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
  
// set up a mongoose model
var SubCategoriesSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});
 
module.exports = mongoose.model('subcategories', SubCategoriesSchema);
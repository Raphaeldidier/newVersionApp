var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var SubCategoriesSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});
  
// set up a mongoose model
var CategoriesSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    subCategories: [SubCategoriesSchema]
});
 
module.exports = mongoose.model('categories', CategoriesSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var GroupsSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
 
module.exports = mongoose.model('Groups', GroupsSchema);
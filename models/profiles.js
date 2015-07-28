var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userProfilesSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'users'
	},
	first_name: String,
	last_name: String,
	under_18: Boolean,
	email: String,
	mobil: String,
	modified: { type: Date, default: Date.now }
},{});

mongoose.model('profiles', userProfilesSchema);
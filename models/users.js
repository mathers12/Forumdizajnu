var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usersSchema = new Schema({
	profile: {
		type: Schema.ObjectId,
		ref: 'profiles'
	},
	seats: {
		type: Schema.ObjectId,
		ref: 'seats'
	}
},{});

mongoose.model('users', usersSchema);
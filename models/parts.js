var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var partsSchema = new Schema({
	tables: [{
		type : Schema.ObjectId,
		ref: 'tables'
	}],
	name: String,
	order: Number,
	positioning: String,
	room: {
		type: Schema.ObjectId,
		ref: 'rooms'
	}
},{});

mongoose.model('parts', partsSchema);
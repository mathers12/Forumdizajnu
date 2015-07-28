var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var tablesSchema = new Schema({
	seats:
        [
		{
				type: Schema.ObjectId,
                ref: 'seats'

		}
	],
	order: Number,
	part: {
		type: Schema.ObjectId,
		ref: 'parts'
	},
	room: {
		type: Schema.ObjectId,
		ref: 'rooms'
	},
	modified: { type: Date, default: Date.now }
},{});

mongoose.model('tables', tablesSchema);

const mongoose = require("../../database/DatabaseManager").mongo;
const mongoosePaginate = require('mongoose-paginate-v2');

const notificationSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
  },
  user:  {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  read_at: {
		type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: function () {
      return new Date(new Date().getTime() + (3 * 60 * 60 * 1000));
    }
  },
});
// Apply the plugin to the schema
notificationSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("Notification", notificationSchema);
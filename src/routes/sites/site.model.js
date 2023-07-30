const mongoose = require("../../database/DatabaseManager").mongo;
const mongoosePaginate = require('mongoose-paginate-v2');

const siteSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  region:  {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Region'
  },
  image_urls: {
		type: Array,
    default: []
  },
  video_urls: {
		type: Array,
    default: []
  },
});

// Apply the plugin to the schema
siteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Site", siteSchema);
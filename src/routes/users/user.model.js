const mongoose = require("../../database/DatabaseManager").mongo;

const userSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  email: {
		type: String,
		lowercase: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 10,
  },
  active: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("User", userSchema);
const mongoose = require("../../database/DatabaseManager").mongo;
const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});


module.exports = mongoose.model('Region', regionSchema);
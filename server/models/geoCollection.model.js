const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GeoSchema = new Schema({
  type: String,
  features: Array,
  user_id: String
});

// Export the model
module.exports = mongoose.model("SingleMap", GeoSchema);

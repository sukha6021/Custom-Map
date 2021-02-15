const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GeoSchema = new Schema({
  name: String,
  type: String,
  img: { data: Buffer, contentType: String },

  center: Object,
  zoom: Number,

  features: {
    type: Array,
    properties: {
      direction: String,
      power: Number,
      user: String,
    },
    geometry: {
      type: {
        type: String,
        enum: ["LineString"],
        required: true,
      },
      coordinates: {
        type: Array,
        index: "2d",
      },
    },
  },
  user_id: {
    type: String,
  },
  published: Boolean,
});

// Export the model
module.exports = mongoose.model("Geo", GeoSchema);

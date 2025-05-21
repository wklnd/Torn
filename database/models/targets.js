const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  player_id: {
    type: String,
    required: true,
    unique: true,
  },
  profile_image: {
    type: String,
    required: false,
  },
  life: {
    current: {
      type: Number,
      required: true,
    },
    maximum: {
      type: Number,
      required: true,
    },
  },
  status: {
    description: {
      type: String,
      required: true,
    },
  },
  last_action: {
    relative: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('Target', TargetSchema);
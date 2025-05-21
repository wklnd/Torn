const mongoose = require('mongoose');

const statHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Timestamp for tracking changes
  strength: Number,
  defense: Number,
  speed: Number,
  dexterity: Number,
  totalstats: Number,
  manuallabor: Number,
  intelligence: Number,
  endurance: Number,
  totalworkingstats: Number,
});

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profile_image: { type: String, required: true },
  personalstats: {
    strength: Number,
    defense: Number,
    speed: Number,
    dexterity: Number,
    totalstats: Number,
    manuallabor: Number,
    intelligence: Number,
    endurance: Number,
    totalworkingstats: Number,
  },
  statHistory: [statHistorySchema], // Array to store historical stats
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
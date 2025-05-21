const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const Player = require('../database/models/player');

const router = express.Router();

dotenv.config();

const apiKey = process.env.TORN_API_KEY;

// Route to fetch and save player data
router.get('/stats', async (req, res) => {
  try {
    // Fetch data from Torn API
    const response = await axios.get(
      `https://api.torn.com/user/?selections=personalstats,profile&key=${apiKey}&comment=KyrnStats`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0',
        },
      }
    );

    const data = response.data;

    // Check if the Torn API returned an error
    if (data.error) {
      console.error('Torn API Error:', data.error);
      return res.status(400).json({ error: data.error.error });
    }

    // Ensure the Torn API response contains the expected fields
    if (!data.name || !data.personalstats) {
      return res.status(400).json({ error: 'Invalid API response' });
    }

    // Extract relevant data
    const playerData = {
      name: data.name,
      profile_image: data.profile_image || '', 
      personalstats: {
        strength: data.personalstats.strength || 0,
        defense: data.personalstats.defense || 0,
        speed: data.personalstats.speed || 0,
        dexterity: data.personalstats.dexterity || 0,
        totalstats: data.personalstats.totalstats || 0,
        manuallabor: data.personalstats.manuallabor || 0,
        intelligence: data.personalstats.intelligence || 0,
        endurance: data.personalstats.endurance || 0,
        totalworkingstats: data.personalstats.totalworkingstats || 0,
      },
    };

    // Find or create the player in the database
    let player = await Player.findOne({ name: playerData.name });

    if (!player) {
      // Create a new player if not found
      player = new Player(playerData);
    } else {
      // Add current stats to statHistory
      player.statHistory.push(player.personalstats);

      // Update personalstats with the latest data
      player.personalstats = playerData.personalstats;
    }

    // Save the player to the database
    await player.save();

    // Send the player data as a response
    res.json({
      name: player.name,
      profile_image: player.profile_image,
      personalstats: player.personalstats,
      statHistory: player.statHistory,
    });
  } catch (error) {
    console.error('Error fetching or saving player data:', error.message);
    res.status(500).json({ error: 'Failed to fetch or save player data' });
  }
});

// Route to get player's stat history
router.get('/stats/history', async (req, res) => {
  try {
    const player = await Player.findOne(); // Assuming one player, or adjust if multiple
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const history = player.statHistory || [];

    // Optionally, include the latest stats as the most recent point
    history.push({
      ...player.personalstats,
      date: new Date() // Add a fake "today" entry
    });

    res.json(history);
  } catch (error) {
    console.error('Error fetching stat history:', error.message);
    res.status(500).json({ error: 'Failed to fetch stat history' });
  }
});



module.exports = router;

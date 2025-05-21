const express = require('express');
const axios = require('axios');
const Target = require('../database/models/targets.js');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

const apiKey = process.env.TORN_API_KEY;

// Route to fetch data from the API and save it to the database
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch data from the Torn API
    const response = await axios.get(`https://api.torn.com/user/${userId}?selections=profile&key=${apiKey}&comment=KyrnStats`);
    const userData = response.data;

    // Validate the response
    if (!userData || !userData.life) {
      return res.status(400).json({ message: 'Invalid API response: Missing life data' });
    }

    // Map the API response to the Target schema
    const targetData = {
      name : userData.name || null,
      level: userData.level || null,
      age: userData.age || null,
      player_id: userData.player_id || null,
      profile_image: userData.profile_image || null,
      life: {
        current: userData.life?.current || null,
        maximum: userData.life?.maximum || null,
      },
      status: {
        description: userData.status?.description || null,
      },
      last_action: {
        relative: userData.last_action?.relative || null,
      },
    };

    // Save or update the data
    const updatedTarget = await Target.findOneAndUpdate(
      { player_id: targetData.player_id }, // Find by player_id
      targetData,                         // New data
      { upsert: true, new: true }          // Create if doesn't exist, return the new doc
    );

    // ✅ Only one response
    res.status(200).json({ message: 'User data saved successfully', data: updatedTarget });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching or saving user data', error: error.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const targets = await Target.find(); // Fetch all targets from MongoDB
    res.status(200).json({ message: 'All targets fetched successfully', data: targets });
  } catch (error) {
    console.error('Error fetching targets:', error);
    res.status(500).json({ message: 'Error fetching targets', error: error.message });
  }
});

router.get('/update', async (req, res) => {
  try {
    const targets = await Target.find(); // Fetch all current targets

    const updatedTargets = [];

    // Loop over each target and update it
    for (const target of targets) {
      const response = await axios.get(`https://api.torn.com/user/${target.player_id}?selections=profile&key=${apiKey}&comment=KyrnStats`);
      const userData = response.data;

      if (!userData || !userData.life) {
        console.warn(`Invalid data for player_id: ${target.player_id}`);
        continue; // Skip invalid users
      }

      // Update target fields
      target.level = userData.level || null;
      target.age = userData.age || null;
      target.profile_image = userData.profile_image || null;
      target.life = {
        current: userData.life?.current || null,
        maximum: userData.life?.maximum || null,
      };
      target.status = {
        description: userData.status?.description || null,
      };
      target.last_action = {
        relative: userData.last_action?.relative || null,
      };

      // Save updated target
      await target.save();
      updatedTargets.push(target);
    }

    res.status(200).json({ message: 'All targets updated successfully', data: updatedTargets });
  } catch (error) {
    console.error('Error updating targets:', error);
    res.status(500).json({ message: 'Error updating targets', error: error.message });
  }
});

router.delete('/:playerId', async (req, res) => {
  const { playerId } = req.params;

  try {
    // Find the target by player_id and delete it
    const deletedTarget = await Target.findOneAndDelete({ player_id: playerId });

    // If no target found, send 404
    if (!deletedTarget) {
      return res.status(404).json({ message: 'Target not found' });
    }

    // Respond with success
    res.status(200).json({ message: 'Target deleted successfully', data: deletedTarget });
  } catch (error) {
    console.error('Error deleting target:', error);
    res.status(500).json({ message: 'Error deleting target', error: error.message });
  }
});

module.exports = router;

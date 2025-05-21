const cron = require('node-cron');
const axios = require('axios');
const dotenv = require('dotenv');
const Target = require('../database/models/targets');

dotenv.config();
const apiKey = process.env.TORN_API_KEY;


cron.schedule('*/10 * * * *', async () => {
  try {
    console.log('Running cron job to update all targets...' + new Date().toLocaleString());

    // Fetch all current targets
    const targets = await Target.find();

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

    console.log('All targets updated successfully.');
  } catch (error) {
    console.error('Error updating targets:', error);
  }
});

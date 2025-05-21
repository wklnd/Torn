const cron = require('node-cron');
const axios = require('axios');

const Player = require('../database/models/player');

const apiKey = process.env.TORN_API_KEY;

// Auto-fetch and save stats every hour
cron.schedule('0 * * * *', async () => {
    console.log('Auto-fetching player stats...' + new Date().toLocaleString());

  try {
    const response = await axios.get(
      `https://api.torn.com/user/?selections=personalstats,profile&key=${apiKey}&comment=KyrnStats`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0',
        },
      }
    );

    const data = response.data;

    if (data.error) {
      console.error('Torn API Error:', data.error);
      return;
    }

    if (!data.name || !data.personalstats) {
      console.error('Invalid API response');
      return;
    }

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

    let player = await Player.findOne({ name: playerData.name });

    if (!player) {
      player = new Player(playerData);
    } else {
      // Push old stats with timestamp
      player.statHistory.push({
        ...player.personalstats,
        date: new Date()
      });

      player.personalstats = playerData.personalstats;
    }

    await player.save();
    console.log('Player stats updated successfully (auto fetch).');
  } catch (error) {
    console.error('Error auto-fetching player stats:', error.message);
  }
});

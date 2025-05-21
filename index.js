const express = require('express');
const bodyParser = require('body-parser');
const targetRoutes = require('./routes/target');
const playerRoutes = require('./routes/player');
require('./database/mongo');

require('./jobs/fetchStatsJobs');

require('./jobs/fetchTarget');

const app = express();

app.use(bodyParser.json());

// Use the target routes
app.use('/api/target', targetRoutes);
app.use('/api/player', playerRoutes);

app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

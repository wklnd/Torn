const express = require('express');
const path = require('path');

const targetRoutes = require('./routes/target');
const playerRoutes = require('./routes/player');

require('./database/mongo');
require('./jobs/fetchStatsJobs');
require('./jobs/fetchTarget');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/target', targetRoutes);
app.use('/api/player', playerRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/torn-targets', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error:', error);
});
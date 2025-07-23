const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/torn-targets', { // replace static IP with dynamic stuff. 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Connection error:', error);
});

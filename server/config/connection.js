const mongoose = require('mongoose');

// localhost changed to 127.0.0.1
// process.env.MONGODB_URI || 
mongoose.connect('mongodb://127.0.0.1:27017/googlebooks?readPreference=primary&ssl=false', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;

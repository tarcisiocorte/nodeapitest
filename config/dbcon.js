const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDataBase = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDataBase;

const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to Database!'))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;

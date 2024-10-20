const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://chandanjotsinghs2:chandanjotsinghs2@mycluster.bcmqn.mongodb.net/'
, {
     // useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

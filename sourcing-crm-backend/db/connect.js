const mongoose = require('mongoose');
// const logger = require('morgan');


async function connect() {
  const dbUri = "mongodb://localhost:27017/recruiter_db";

  try {
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
      });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = connect;
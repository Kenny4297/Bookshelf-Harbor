const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sampleapp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected successfully'))
.catch(err => console.log(err));

module.exports = mongoose.connection;

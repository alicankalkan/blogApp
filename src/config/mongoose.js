const mongoose = require("mongoose");
const connectionUrl = process.env.DB;
const checkConnection = mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});


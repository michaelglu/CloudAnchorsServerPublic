const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb://localhost:27017/CloudAnchors",
  (err, db) => {
    if (err) {
      return console.log("error connecting to db servers");
    }
    console.log("connected to MongoDB server");
    db.close();
  }
);

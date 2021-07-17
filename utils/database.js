const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        `mongodb+srv://Ruturaj:ruturaj@cluster0.6biak.mongodb.net/Policies?retryWrites=true&w=majority`
      )
        .then((client) => {
            console.log("Connected");
            _db = client.db();
            callback();
        })
        .catch((error) => {
          throw error;
        });
}

const getDB = () => {
  if(_db){
    return _db;
  }
  throw "No Database Found!";
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB

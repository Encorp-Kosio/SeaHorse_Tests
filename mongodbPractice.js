import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;
const connectionStr = 'mongodb://localhost:27017';
const client = new MongoClient(connectionStr);
client.connect(function(err) {
    const db = client.db('seaHorseDB');
    const people = db.collection('days');
    people.insertOne({ 'date': '15.05.2024' }, (err, result) => {
      people.find({ date: '15.05.2024' }).toArray((err, data) => {
        console.log(data);
      });
    });
  });

// client.close();

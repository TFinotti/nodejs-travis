var mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
// Connection URL
const url: string = 'mongodb://localhost:27017';
// Database Name
const dbName: string = 'mydb';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });
// Use connect method to connect to the Server
client.connect(function (err: Error | null) {
    if (err) {
        throw err
    }
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    // Do something ...
    // insertDocument(db, function () {
    //     client.close();
    // });
    // insertManyDocuments(db, function () {
    //     client.close();
    // });
    findDocuments(db, function () {
        client.close();
    });
});

interface Metric {
    timestamp: string;
    value: number;
}

const insertDocument = function (db: any, callback: any) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some document
    const metric: Metric = {
        timestamp: new Date().getTime().toString(),
        value: 42
    }
    collection.insertOne(
        metric,
        function (err: any, result: any) {
            if (err)
                throw err
            console.log("Document inserted into the collection");
            callback(result);
        })
};

const insertManyDocuments = function (db: any, callback: any) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    const metrics: Metric[] = [
        { timestamp: new Date().getTime().toString(), value: 11 },
        { timestamp: new Date().getTime().toString(), value: 22 },
        { timestamp: new Date().getTime().toString(), value: 22 },
    ]
    collection.insertMany(
        metrics,
        function (err: any, result: any) {
            if (err)
                throw err
            console.log("Document inserted into the collection");
            callback(result);
        });
}

const findDocuments = function (db: any, callback: any) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({'value': 42}).toArray(function (err: any, docs: object) {
        if (err)
            throw err
        console.log("Found the following documents");
        console.log(docs)
        callback(docs);
    });
}
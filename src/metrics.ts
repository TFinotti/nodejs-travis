export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

// export class MetricsHandler {
//   static get(callback: (error: Error | null, result?: Metric[]) => void) {
//     const result = [
//       new Metric('2013-11-04 14:00 UTC', 12),
//       new Metric('2013-11-04 14:30 UTC', 15)
//     ]
//     callback(null, result)
//   }
// }

export class MetricsHandler {
  private db: any

  constructor(db: any) {
    this.db = db;
  }

  public save(metric: Metric, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')
    // Insert some document
    collection.insertOne(
      metric,
      function (err: any, result: any) {
        if (err)
          return callback(err, result)
        console.log("Document inserted into the collection")
        callback(err, result)
      });
  }

  public get(parameter: number, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')

    if (parameter > 0) {
      collection.find({ 'value': parameter }).toArray(function (err: any, docs: object) {
        if (err)
          throw err
        console.log("Found the following documents");
        console.log(docs)
        callback(err, docs);
      });
    } else {
      collection.find({}).toArray(function (err: any, docs: object) {
        if (err)
          throw err
        console.log("Found the following documents");
        console.log(docs)
        callback(err, docs);
      });
    }
  }

  public delete(parameter: number, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')

    collection.deleteOne({ 'value': parameter }, function (err: any, docs: object) {
      if (err)
        throw err
      console.log("Deleted the following documents");
      console.log(docs)
      callback(err, docs);
    });
  }
}
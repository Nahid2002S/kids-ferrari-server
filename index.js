const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//Nahid2002
//jmAep1MyzQGt30CS

const uri = "mongodb+srv://Nahid2002:jmAep1MyzQGt30CS@cluster0.lek3e6k.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db("toyDB").collection('toy');

    app.get('/toy', async(req, res)=>{
      const cursor = toyCollection.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/toy/:id', async(req, res)=>{
      const id = req.params.id;
       const query = {_id : new ObjectId(id)}
       const result = await toyCollection.findOne(query);
       res.send(result)
    })

    app.put('/toy/:id', async(req, res) =>{
       const id = req.params.id;
       const filter = {_id : new ObjectId(id)}
       const options = { upsert: true };
       const updatedToy = req.body;

       const updateToy = {
        $set: {
        price : updatedToy.price,
        quantity : updatedToy.quantity,
        details : updatedToy.details
      },
    };
    const result = await toyCollection.updateOne(filter, updateToy, options);
    res.send(result)
    })

    app.delete('/toy/:id', async(req, res)=>{
       const id = req.params.id;
       const query = {_id : new ObjectId(id)}
       const result = await toyCollection.deleteOne(query);
       res.send(result);
    })

    app.get("/mytoy/:email", async (req, res) => {
      const myToys = await toyCollection
        .find({
          sellerEmail: req.params.email,
        })
        .toArray();
      res.send(myToys);
    });

    app.get("/ascending/:email", async (req, res) => {
      const myToys = await toyCollection
        .find({
          sellerEmail: req.params.email,
        }).sort({price : 1})
        .toArray();
      res.send(myToys);
    });

    app.get("/descending/:email", async (req, res) => {
      const myToys = await toyCollection
        .find({
          sellerEmail: req.params.email,
        }).sort({price : -1})
        .toArray();
      res.send(myToys);
    });

    app.post('/toy', async(req, res)=>{
       const newToy = req.body;
       const result = await toyCollection.insertOne(newToy)
       res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Assignment 11 is running')
})


app.listen(port, () =>{
    console.log(`Assignment 11 is Running On Port ${port}`)
})
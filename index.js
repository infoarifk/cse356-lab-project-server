const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();


const port = process.env.PORT || 5000;

//middleware

app.use(cors());

app.use(express.json());

//mongoDB connection

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.nud4ico.mongodb.net/?retryWrites=true&w=majority`;

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
    
    await client.connect();
    const database = client.db("TestServer");
    const userCollection = database.collection("users");

    //receive data from mongoDB
    app.get("/users", async(req, res)=>{

      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    //receive data from client side
    app.post("/users", async(req, res)=>{

      const user = req.body;
      console.log("received users: ", user);

      //send data to database
      const result = await userCollection.insertOne(user);
      res.send(result);

    });

    //delete from database

  app.delete(`/users/:id`, async(req, res)=>{

    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const result = await userCollection.deleteOne(query);
    res.send(result);

  })
    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    
  }
}
run().catch(console.dir);


//express functionality

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });




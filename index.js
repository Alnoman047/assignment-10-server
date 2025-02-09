const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middlewares
app.use(cors())
app.use(express.json());
require('dotenv').config()




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwa6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const itemsCollection = client.db("artDiaryDB") .collection("items");
    const cardCollection = client.db("artDiaryDB") .collection("cards");


    // add items------------------------------------
    app.post("/addItems",async(req,res)=>{
        const items = req.body;
        const result =await itemsCollection.insertOne(items);
        res.send(result);
    })

    app.get("/addItems",async(req,res)=>{
        const cursor = itemsCollection.find();
        const result = await cursor.toArray();
        res.send(result)

    })
    app.get("/addItems/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await itemsCollection.findOne(query);
        res.send(result);
    })

    app.put("/addItems/:id",async(req,res)=>{
      const id = req.params.id;
      const item = req.body;
      const filter ={_id: new ObjectId(id)};
      const options = {upsert:true};
      const updateDoc = {
        $set:{
          imgURL: item.imgURL,
          itemName: item.itemName,
          subcategory: item.subcategory,
          description: item.description,
          price: item.price,
          rating:item.rating,
          customization: item.customization,
          stock: item.stock,
          email: item.email,
          name: item.name
        }
      }
      const result = await itemsCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    })

    // ----------------------------------------------

    // cards-----------------------------------------

    app.post("/cards",async(req,res)=>{
      const cards= req.body;
      const result = await cardCollection.insertOne(cards);
      res.send(result);
    })

    app.get("/cards",async(req,res)=>{
      const cards = cardCollection.find();
      const result = await cards.toArray();
      res.send(result)
    })

    app.get("/cards/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cardCollection.findOne(query);
      res.send(result)
    })




    // ----------------------------------------------
























    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);























app.get("/",(req,res)=>{
    res.send("server is running")
});

app.listen(port,()=>{
    console.log("server is running on port: ",port)
})